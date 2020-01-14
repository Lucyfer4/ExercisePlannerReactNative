import * as WebBrowser from 'expo-web-browser';
import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,

} from 'react-native';
import {CheckBox, ListItem, Header} from 'react-native-elements';
import {Left, Right, Icon} from 'native-base';

import {MonoText} from '../components/StyledText';
import firebase from "firebase";
import {NavigationActions, StackActions} from 'react-navigation';
import {AsyncStorage} from 'react-native';


export default class HomeScreen extends Component {


    constructor(props) {
        super(props);

        this.state = {
            exerciseCollection: {},
            selectedMuscles: [],
            muscles: [],
            selectedEquiptmant: [],
            equiptmant: [{name: 'dumbbell'}, {name: 'machine'}, {name: 'body'}, {name: 'barbell'}],
            exercises: [],
            exercisesDisplayed: [],
            loaded: false
        };

        storeData(this.props.navigation.getParam('user', 'default'));

    }


    componentWillMount() {
        firebase.database().ref("exercises").once('value', (data) => {
            var exerciseCollection;
            exerciseCollection = data.toJSON();

            var muscleGroupsFromDB = [];
            var exercisesFromDB = [];

            for (var upperAndLower in exerciseCollection) {
                var muscleGroups = exerciseCollection[upperAndLower];

                for (var muscleGroup in muscleGroups) {
                    muscleGroupsFromDB.push(muscleGroup);
                    var exercises = muscleGroups[muscleGroup];

                    for (var exercise in exercises) {
                        var exerciseOBJ = exercises[exercise];
                        exerciseOBJ.upperLower = upperAndLower;
                        exerciseOBJ.muscle = muscleGroup;
                        exerciseOBJ.id = exercise;
                        exercisesFromDB.push(exerciseOBJ);
                    }
                }
            }

            this.setState({
                muscles: muscleGroupsFromDB,
                exercises: exercisesFromDB,
                loaded: true
            });
        });
    }

    render() {

        if (!this.state.loaded) {
            return null;
        }

        var muscleCheckboxes = [];
        this.state.muscles.forEach(function (currentMuscle) {
            var isSelected = false;
            this.state.selectedMuscles.forEach(function (currentSelectedMuscle) {
                if (currentMuscle === currentSelectedMuscle) {
                    isSelected = true;
                }
            });
            muscleCheckboxes.push(
                <CheckBox onPress={() => this.handleMuscleSelection(currentMuscle)}
                          title={currentMuscle}
                          checked={isSelected}
                          key={currentMuscle}
                />
            );

        }.bind(this));

        var equiptmantCheckboxes = [];


        this.state.equiptmant.forEach(function (currentEquiptmant) {
            var isSelected = false;
            this.state.selectedEquiptmant.forEach(function (currentSelectedEquitpment) {
                if (currentEquiptmant.name === currentSelectedEquitpment) {
                    isSelected = true;
                }
            });
            equiptmantCheckboxes.push(
                <CheckBox onPress={() => this.handleEquiptmantSelection(currentEquiptmant.name)}
                          title={currentEquiptmant.name}
                          checked={isSelected}
                          key={currentEquiptmant.name.toString()}
                />
            );

        }.bind(this));


        return (
            <View style={styles.container}>

                {/* <Header
                    leftComponent={<Icon name="menu" onPress={() => this.props.navigation.openDrawer()} />}
                />
*/}
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={
                                require('../assets/images/icon.png')
                            }
                            style={styles.welcomeImage}
                        />
                    </View>

                    <View style={styles.getStartedContainer}>

                        <Text style={styles.welcomeText}>Welcome back to the Workout Planner</Text>

                        <Text style={styles.getStartedText}>
                            Why not checkout some new Exercises?
                        </Text>
                    </View>

                    <View style={styles.muscleSelector}>
                        {/*<TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>

          </TouchableOpacity>*/}
                        <Text style={styles.helpLinkText}>
                            Which Muscles Are You Targeting?
                        </Text>

                        {muscleCheckboxes}

                    </View>

                    <View style={styles.equiptmantSelector}>

                        <Text style={styles.helpLinkText}>
                            What Equiptment Do You Have Available?
                        </Text>

                        {equiptmantCheckboxes}

                    </View>


                    <View style={styles.exersises}>
                        <FlatList
                            data={this.state.exercisesDisplayed}
                            //renderItem={({item}) => <Text style={styles.item}>{item.name}{item.io}</Text>}
                            renderItem={this.renderRow.bind(this)}
                        />
                    </View>


                </ScrollView>


            </View>
        );
    }

    renderRow({item}) {
        const {navigate} = this.props.navigation;


        return (
            <ListItem style={styles.exersise}
                key={item.id}
                title={item.name}
                leftAvatar={{ source: { uri: '../assets/images/icon.png' } }}
                onPress={() =>
                    this.props.navigation.navigate('EDisplay', {
                        user: this.props.navigation.getParam('user', 'default'),
                        id: item.id,
                        muscle: item.muscle,
                        upperLower: item.upperLower
                    })}

            />
        )
    }

    handleMuscleSelection(value) {
        var newSelected = this.state.selectedMuscles;
        var found = false;

        this.state.selectedMuscles.forEach(function (currentMuscle) {
            if (currentMuscle === value) {
                found = true;
            }
        });

        if (!found) {
            newSelected.push(value);
        } else {
            var indexToRemove = newSelected.indexOf(value);
            newSelected.splice(indexToRemove, 1);
        }
        this.setState({
            selectedMuscles: newSelected,
        });

        this.doExerciseFiltering();

        return function () {
        };
    }


    handleEquiptmantSelection(value) {
        var newSelected = this.state.selectedEquiptmant;
        var found = false;

        this.state.selectedEquiptmant.forEach(function (currentEquipment) {
            if (currentEquipment === value) {
                found = true;
            }
        });
        if (!found) {
            newSelected.push(value);
        } else {
            var indexToRemove = newSelected.indexOf(value);
            newSelected.splice(indexToRemove, 1);
        }
        this.setState({
            selectedEquiptmant: newSelected,
        });

        this.doExerciseFiltering();

        return function () {
        };

    }


    doExerciseFiltering() {
        var tempSelectedExcercises = [];
        var exercises = this.state.exercises;
        var selectedMuscles = this.state.selectedMuscles;
        var selectedEquipment = this.state.selectedEquiptmant;

        exercises.forEach(function (currentExcercise) {

            var matchingMuscle = false;
            var matchingEquipment = false;

            selectedMuscles.forEach(function (currentSelectedMuscle) {
                if (currentExcercise.muscle === currentSelectedMuscle) {
                    matchingMuscle = true;
                }
            });


            selectedEquipment.forEach(function (currentSelectedEquipment) {
                if (currentExcercise.equipment === currentSelectedEquipment) {

                    matchingEquipment = true;
                }
            });


            if (matchingMuscle && matchingEquipment) {
                tempSelectedExcercises.push(currentExcercise);
            }

        });


        this.setState({
            exercisesDisplayed: tempSelectedExcercises,
        });
    }
}



HomeScreen.navigationOptions = {
    header: null,
};

async function storeData(id) {

    try {
        await AsyncStorage.setItem('userID', id);
    } catch (error) {
        console.log(error);
    }

}

function handleLearnMorePress() {
    WebBrowser.openBrowserAsync(
        'https://docs.expo.io/versions/latest/workflow/development-mode/'
    );
}

function handleHelpPress() {
    WebBrowser.openBrowserAsync(
        'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
    );
}

const styles = StyleSheet.create({
    welcomeText: {
        fontSize: 22,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 250,
        height: 200,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {width: 0, height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    exersises: {
        marginTop: 15
    },
    muscleSelector: {
        marginTop: 15,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#d6d7da'
    },
    equiptmantSelector: {
        marginTop: 15,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#d6d7da'
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
    exersise: {
        width: 500,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        paddingLeft: 100

    }
});
