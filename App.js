import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from "firebase";

import AppNavigator from './navigation/AppNavigator';
export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);



    if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator



        />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);

    var firebaseConfig = {
        apiKey: "AIzaSyDxGDPVHCVAxKinqwlgCF-jzXEy3JgxixA",
        authDomain: "exercise-planner-969c9.firebaseapp.com",
        databaseURL: "https://exercise-planner-969c9.firebaseio.com",
        projectId: "exercise-planner-969c9",
        storageBucket: "exercise-planner-969c9.appspot.com",
        messagingSenderId: "391373906806",
        appId: "1:391373906806:web:3337c8a53f46fefce65057"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    /*firebase.database().ref('test/1').set(
        {
            name: 't'
        }
    ).then(() => {
        console.log('Inserted');
    }).catch((error) => {
        console.log(error);
    });*/
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
