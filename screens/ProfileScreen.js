import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Button, FlatList, Platform, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {AsyncStorage} from 'react-native';
import firebase from "firebase";
import {ListItem} from "react-native-elements";
import {LoginInput} from "../components/LoginInput";

var userID;

async function getUserID() {
  try {
    const value = await AsyncStorage.getItem('userID');
    if (value !== null) {
      // We have data!!
      userID = value;
      return value;
    }
  } catch (error) {
    console.log(error);
  }

}

export default class ProfileScreen extends Component{


  constructor(props){
    super(props);
    getUserID().then((id) => this.getUserPlans(id));

    this.state = {
      userPlans: [],
      newPlanName: ''
    };


  }

  static navigationOptions = ({ navigation }) => ({


    title: navigation.getParam('id', 'A Nested Details Screen').replace(/([A-Z])/g, ' $1').trim(),

  });

  getUserPlans(id){

    firebase.database().ref("users").once('value', (data) => {
      //console.log(data.toJSON());

      var users = data.toJSON();
      var userPlansFromDB = [];//

      for (var userIncrement in users){
        var currentUser = users[userIncrement];

        if(currentUser.id === id){
          var plans = currentUser.plans;

          for (var planIncrement in plans){
            var currentPlan = plans[planIncrement];
            userPlansFromDB.push(currentPlan);
          }
        }


      }

      this.setState( {
        userPlans: userPlansFromDB
      })

    });


  }

  handleNewPlan(){

    var userDBID = '';

    firebase.database().ref("users").once('value', (data) => {

      var users = data.toJSON();

      for (var userIncrement in users){
        var currentUser = users[userIncrement];

        if(currentUser.id === userID){
          userDBID = userIncrement;
        }
      }

      console.log('users/' + userDBID + '/plans');

      var eReference = firebase.database().ref('users/' + userDBID + '/plans');
      var eRefereneceRegister = eReference.push();

      var exercisePlanOBJ = {
        name: this.state.newPlanName

      };
     eRefereneceRegister.set(exercisePlanOBJ).catch(error => console.log(error) );

      this.getUserPlans(userID);

    });





  }


  render() {

    return (
        <View style={styles.container}>

          <ScrollView>

          <View style={styles.exersises}>
            <FlatList
                data={this.state.userPlans}
                //renderItem={({item}) => <Text style={styles.item}>{item.name}{item.io}</Text>}
                renderItem={this.renderRow.bind(this)}
            />
          </View>

          <LoginInput
              label={'Make A New Plan?'}
              placeholder={'Enter A New Plan Name Here'}
              onChangeText={newPlanName => this.setState({newPlanName})}
          />

          <Button
              title="Submit"
              onPress={() => this.handleNewPlan()}
          />

          </ScrollView>

        </View>
    );
  }

  renderRow({item}) {
    const {navigate} = this.props.navigation;


    return (
        <ListItem style={styles.plan}
                  key={item.name}
                  title={item.name}
                  leftAvatar={{ source: { uri: '../assets/images/icon.png' } }}
                  onPress={() =>
                      this.props.navigation.navigate('PDisplay', {
                        user: this.props.navigation.getParam('user', 'default'),
                        id: item.name
                      })}

        />
    )
  }

}

ProfileScreen.navigationOptions = {
  title: 'Your Profile',
};

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


