import React, {Component} from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    AsyncStorage,
    FlatList
} from 'react-native';
import {ExpoLinksView} from '@expo/samples';
import firebase from "firebase";
import {ListItem} from "react-native-elements";

var userID;


async function getUserID() {
    try {
        const value = await AsyncStorage.getItem('userID');
        if (value !== null) {
            userID = value;
            return value;
        }
    } catch (error) {
        console.log(error);
    }

}

export default class EDisplayScreen extends Component {



    constructor(props) {
        super(props);
        getUserID().then((id) => this.getUserPlans(id));

        this.state = {
            userPlans: [],
            newPlanTitle: ''
        };


    }

    getUserPlans(id){
        firebase.database().ref("users").once('value', (data) => {
            var userCollection;
            userCollection = data.toJSON();
            var userPlansFromDB = [];

            for (var user in userCollection) {
                var currentUser = (userCollection[user]);
                if(currentUser.id === id){
                    var currentUserPlans = currentUser.plans;

                    if(currentUserPlans !== null) {
                        var plansArray = Object.values(currentUserPlans);
                        console.log(plansArray);


                        for(var planRaw in plansArray){



                            var currentPlanOBJ = {
                                name: plansArray[planRaw].name
                            };

                            userPlansFromDB.push(currentPlanOBJ);

                        }
                    }
                }
            }
//
            this.setState({
                userPlans: userPlansFromDB,
            });

        });
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Add ' + navigation.getParam('EName', 'default') + ' To A Plan'
    });

    render() {

        return (
            <View style={styles.container}>

                <View style={styles.plans}>
                    <FlatList
                        data={this.state.userPlans}
                        //renderItem={({item}) => <Text style={styles.item}>{item.name}{item.io}</Text>}
                        renderItem={this.renderRow.bind(this)}
                    />
                </View>

{/*
                <Text style={styles.label}>{ 'Create A New Plan' }</Text>
                <TextInput
                        autoCorrect={false}
                        style={styles.input}
                        onChangeText={newPlanTitle => this.setState({newPlanTitle})}
                />

                <Button style={styles.plan}
                    //key={item.id}
                        title={'Create A New Plan'}
                        onPress={() => this.handleNewPlanCreation(item.name)}

                />*/}

            </View>





        );
    }

    renderRow({item}) {
        const {navigate} = this.props.navigation;


        return (
            <Button style={styles.plan}
                      //key={item.id}
                      title={item.name}
                      leftAvatar={{ source: { uri: '../assets/images/icon.png' } }}
                      onPress={() => this.handleNewExerciseForPlan(item.name)}

            />
        )
    }

    handleNewExerciseForPlan(planName) {
        console.log('exercises/' + this.props.navigation.getParam('EPath', 'default') + '/registered-users');

        var eReference = firebase.database().ref('exercises/' + this.props.navigation.getParam('EPath', 'default') + '/registered-users');
        var eRefereneceRegister = eReference.push();

        var exercisePlanOBJ = {
            user: userID,
            planName: planName

        };
        eRefereneceRegister.set(exercisePlanOBJ).catch(error => console.log(error) );

        this.props.navigation.navigate('Home', {user: firebase.auth().currentUser.uid});

    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
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
    imageContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    exerciseImage: {
        width: 250,
        height: 200,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    instructionsContainer: {
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
    instructionsText: {
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
    plans: {
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
    label: {
        padding: 5,
        paddingBottom: 0,
        color: '#333',
        fontSize: 17,
        fontWeight: '700',
        width: '100%',
    },
    input: {
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 2,
        color: '#333',
        fontSize: 18,
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#da1610'
    },
    plan: {
        width: 500,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        paddingLeft: 100

    }
});

