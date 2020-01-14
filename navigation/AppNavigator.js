import React from 'react';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";

import MainTabNavigator from './MainTabNavigator';

const LoginStack = createStackNavigator(
    {
        Login: LoginScreen,
        Signup: SignUpScreen
    }
);

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Login: LoginStack,
    Main: MainTabNavigator,
  }

));
