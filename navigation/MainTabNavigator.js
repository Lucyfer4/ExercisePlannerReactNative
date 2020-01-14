import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EDisplayScreen from '../screens/EDisplayScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlanScreen from '../screens/PlanScreen';
import { NavigationActions, StackActions } from 'react-navigation'
import AddToPlanScreen from "../screens/AddToPlanScreen";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    EDisplay: EDisplayScreen,
      AddToPlan: AddToPlanScreen
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';


const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
      PDisplay: PlanScreen,
      EDisplay: EDisplayScreen,

  },
  config
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

ProfileStack.path = '';

const tabNavigator = createBottomTabNavigator({
    HS: HomeStack,
    PS: ProfileStack
});

tabNavigator.path = '';

export default tabNavigator;






/*const EDisplayStack = createStackNavigator(
  {
    EDisplay: EDisplayScreen,
  },
  config
);

EDisplayStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

EDisplayStack.path = '';*/
