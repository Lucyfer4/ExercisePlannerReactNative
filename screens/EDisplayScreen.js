import React, {Component} from 'react';
import {Image, Platform, ScrollView, StyleSheet, Text, View, Button} from 'react-native';
import {ExpoLinksView} from '@expo/samples';
import firebase from "firebase";

export default class EDisplayScreen extends Component {

    constructor(props) {
        super(props);

        var params = props.navigation.state.params;

        var id = this.props.navigation.getParam('id', 'default');
        //var id = params.id;
        var muscle = this.props.navigation.getParam('muscle', 'default');
        var upperLower = this.props.navigation.getParam('upperLower', 'default');


        this.state = {
            exercisePath: upperLower + "/" + muscle + "/" + id,
            name: '',
            images: [],
            instructions: '',
            loaded: false
        };

        firebase.database().ref('exercises/' + this.state.exercisePath).once('value', (data) => {

            this.setState({
                name: data.toJSON().name,
                images: data.toJSON().images,
                instructions: data.toJSON().instructions,
                loaded: true
            });


        });


    }

    static navigationOptions = ({ navigation }) => ({


        title: navigation.getParam('id', 'A Nested Details Screen').replace(/([A-Z])/g, ' $1').trim(),

    });



    render() {

        if (!this.state.loaded) {
            return null;
        }


        // todo: Change Source to Be actual Image link
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
                    <View style={styles.imageContainer}>


                        <Image
                            source={
                                require('../assets/images/icon.png')
                            }
                            style={styles.exerciseImage}
                        />
                    </View>

                    <View style={styles.instructionsContainer}>

                        <Text style={styles.instructions}>{this.state.instructions}</Text>



                    <Button
                        title="Add To A Plan"
                        onPress={() => this.props.navigation.navigate('AddToPlan', {EName: this.state.name, EPath: this.state.exercisePath})}
                    />

                    </View>

                </ScrollView>


            </View>





        );
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
    exersises: {
        marginTop: 15,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#d6d7da'
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
});

