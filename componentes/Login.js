import React from 'react';

import { View, Text, Image } from 'react-native';

import logo1 from '../assets/logo1.png';

import 'firebase/firestore';

import login from '../assets/login.jpg';
import LoginScreen from "react-native-login-screen";

import * as firebase from 'firebase/app';
import 'firebase/auth';

export default class Login extends React.Component{

    constructor(){
        super();
        this.state = {
            email: "",
            senha: "",
        }
        this.logar = this.logar.bind(this);
    }

    logar(){
        let { email } = this.state;
        let { senha } = this.state;
    
        if(email === '' || senha === '') return alert("Preencha o e-mail e senha corretamente.");
    
        this.setState({loading: true});
    
        try{
            firebase.auth().signInWithEmailAndPassword(email, senha)
                .then((_user) => { 
                  this.setState({loading: false});
                  this.props.navigation.navigate("HomeAdm", {logado: true});
                 })
                .catch((_error) => {alert("Email ou senha incorretos! Tente novamente."); this.setState({loading: false})});
        }catch(_error){
            this.setState({loading: false})
        }
    }

    render(){
        return(
            <LoginScreen
                usernameOnChangeText={username => this.setState({email: username})}
                passwordOnChangeText={password => this.setState({senha: password})}
                spinnerEnable={true}
                onPressLogin={() => this.logar()}
                loginText="Entrar"
                source={login}
                logoComponent={<View style={{flexDirection: "row"}}><Text style={{color: 'white', alignSelf:'center', fontSize:30, fontWeight: 'bold', marginRight: 10}}>Patrimônio</Text><Image style={{height:64, width:64}} source={logo1}/></View>}
            />
        );
    }
}
