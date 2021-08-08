import React from 'react';
import { AppLoading } from 'expo';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import Home from './componentes/Home';
import ListaSalas from './componentes/ListaSalas';
import Sala from './componentes/Sala';
import Camera from './componentes/Camera';

import HomeAdm from './componentes/HomeAdm';

import Login from './componentes/Login';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  Home,
  Sala,
  Camera,
  ListaSalas,
  Login,
  HomeAdm
},{
  initialRouteName: 'Home',
  headerMode: 'none',
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render(){
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <AppContainer/>
    );
  }
}