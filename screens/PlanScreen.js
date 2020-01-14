import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {FlatList, Platform, StyleSheet, View} from "react-native";
import {AsyncStorage, ScrollView} from 'react-native';
import firebase from "firebase";
import {ListItem} from "react-native-elements";

async function getUserID() {
  try {
    const value = await AsyncStorage.getItem('userID');
    if (value !== null) {
      // We have data!!
      return value;
    }
  } catch (error) {
    console.log(error);
  }

}

export default class PlanScreen extends Component{


  constructor(props){
    super(props);
    console.log('ps');

    getUserID().then((id) => this.getUserExersises(id, this.props.navigation.getParam('id', 'default')));

    this.state = {
      planExersises: []
    };


  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('id', 'A Nested Details Screen').replace(/([A-Z])/g, ' $1').trim(),
  });


  getUserExersises(userId, planID ){
    firebase.database().ref("exercises").once('value', (data) => {
      var exerciseCollection;
      exerciseCollection = data.toJSON();
      var userExcersisesFromDB = [];

      for (var upperAndLower in exerciseCollection) {
        var muscleGroups = exerciseCollection[upperAndLower];

        for (var muscleGroup in muscleGroups) {
          var exercises = muscleGroups[muscleGroup];

          for (var exercise in exercises) {
            var exerciseOBJ = exercises[exercise];
            //console.log(exerciseOBJ);//
            var exerciseOBJRegUsers = Object.values(exerciseOBJ['registered-users']);
            //



            for (var regUser in exerciseOBJRegUsers) {
              console.log( exerciseOBJRegUsers[regUser]);
              if(exerciseOBJRegUsers[regUser].user === userId && exerciseOBJRegUsers[regUser].planName === planID){
                //console.log(exerciseOBJ);
                exerciseOBJ.upperLower = upperAndLower;
                exerciseOBJ.muscle = muscleGroup;
                exerciseOBJ.id = exercise;
                userExcersisesFromDB.push(exerciseOBJ);

              }

            }
          }
          }
        }
      this.setState({
        planExersises: userExcersisesFromDB,
      });

      console.log(this.state.planExersises);

    });
  }


  render() {

    return (
        <View style={styles.container}>

          <ScrollView>

          <View style={styles.exersises}>
            <FlatList
                data={this.state.planExersises}
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
        <ListItem style={styles.plan}
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



}
/*
PlanScreen.navigationOptions = {
  title: navigation.getParam('id', 'default'),
};*/

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
  plan: {
    width: 500,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    paddingLeft: 100

  }
});


