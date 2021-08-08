import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import ListaSalas from './ListaSalas';

import { Ionicons } from '@expo/vector-icons';
import {Header, Right, Body, Title, Button, Icon, Content, Card } from 'native-base';

import { firebaseConfig } from '../firebase/Config';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import MenuHamburger from './MenuHamburger';

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export default class Home extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      todasCategorias: [],
      categorias: [],
      salasBuscadas: [],
      snapshot: [],
      exibirMenu: false,
    }
    this.mostrarCategorias = this.mostrarCategorias.bind(this);
    this.buscarNomesCategorias = this.buscarNomesCategorias.bind(this);
    this.alterarExibicaoMenu = this.alterarExibicaoMenu.bind(this);
    this.logar = this.logar.bind(this);
  }

  alterarExibicaoMenu(){
    this.setState({exibirMenu: !this.state.exibirMenu});
  }

  async componentDidMount(){
    await db.collection("categorias").onSnapshot((snapshot) => {
      let categorias = [];

      snapshot.forEach((categoria) => {
        let dadosCategoria = {
          data: categoria.data(),
          ref: categoria.ref,
        }
        categorias.push(dadosCategoria);
      });
  
      this.setState({categorias, todasCategorias: categorias});
      this.render();
    });
  }

  buscarNomesCategorias(palavraBuscada){
    let categorias = this.state.todasCategorias;

    let categoriasBuscadas = [];
    let salasBuscadas = [];

    let palavra = palavraBuscada.toLowerCase();

    if(palavra === ''){
      categoriasBuscadas = categorias;
    }else{
      for(categoria of categorias){
        let nomeCategoria = categoria.data.nome.toLowerCase();
        if(nomeCategoria.indexOf(palavra) > -1){
          categoriasBuscadas.push(categoria);
        }else{
          let salas = categoria.data.salas;
          salas.forEach((sala) => {
            let nomeSala = sala.nome.toLowerCase();
            if(nomeSala.indexOf(palavra) > -1){
              salasBuscadas.push(sala);
            }
          });
        }
      }
    }

    this.setState({categorias: categoriasBuscadas, salasBuscadas});
    this.render();
  }

  mostrarCategorias(){
    let categorias = this.state.categorias;
    let salasBuscadas = this.state.salasBuscadas;

    if(salasBuscadas.length > 0){
      let listaSalas = [];
      salasBuscadas.forEach((sala) => {
        let alerta = false;

        let patrimonios = sala.patrimonios;
        patrimonios.forEach((patrimonio) => {
          if(patrimonio.situacao === 'Indefinido'){
            alerta = true;
          }
        });

        let dadosSala = {
          titulo: sala.nome,
          patrimonios: sala.patrimonios,
          alerta,
          ref: categoria.ref,
        };
        listaSalas.push(dadosSala);
      });
      
      return (
        <View>
          <Text style={styles.textSalas}>Resultados da busca:</Text>
          <ListaSalas navigation={this.props.navigation} data={listaSalas}/>
        </View>
      );
    }else{
      return categorias.map((categoria, key) => {
        let salas = categoria.data.salas;
        let listaSalas = [];

        salas.forEach((sala) => {
          let alerta = false;

          let patrimonios = sala.patrimonios;
          patrimonios.forEach((patrimonio) => {
            if(patrimonio.situacao === 'Indefinido'){
              alerta = true;
            }
          });

          let dadosSala = {
            titulo: sala.nome,
            patrimonios: sala.patrimonios,
            alerta,
            ref: categoria.ref,
          };
          listaSalas.push(dadosSala);
        });
  
        return (
          <View key={key}>
            <Text style={styles.textSalas}>{categoria.data.nome}</Text>
            <ListaSalas navigation={this.props.navigation} data={listaSalas}/>
          </View>
        );
      });
    }
  }
  logar(){
    this.props.navigation.navigate('Login');
  }

  render(){
    return (
      <View style={styles.mainContainer}>
        <Header>
          <Body>
            <Title>Controle Patrimonial</Title>
          </Body>
  
          <Right>
          
          {this.state.exibirMenu && 
          <MenuHamburger 
            texto={this.state.logado ? "Sair" : "Login"}
            acao={this.logar} />}

            <Button onPress={() => this.alterarExibicaoMenu()} transparent>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
        
        <View style={styles.rowContainer}>
            <TextInput
                style={styles.barraPesquisa}
                onChangeText={text => this.buscarNomesCategorias(text)}
                padding={10}
                placeholder='Buscar Sala ...'
                />
            <Ionicons name="md-search" size={40} color="green" />
        </View>
  
        <View style={styles.center}>
            <Text style={styles.textInfo}>Selecione a sala para análise:</Text>
        </View>

        <ScrollView style={styles.salas}>
            {this.mostrarCategorias()}

            <View style={styles.fixoBaixo}>
                <Button style={styles.botaoDownload}
                onPress={() => this.props.navigation.goBack()}>
                  <Text style={styles.textoDownload}>Importar Dados</Text>
                </Button>
              </View>
        </ScrollView>
            
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#151416',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  barraPesquisa: {
    color: 'white',
    width: '92%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 50,
  },
  center: {
    alignItems: 'center',
  },
  textInfo: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'white',
  },
  salas: {
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#d6d7da',
  },
  textSalas: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#AAAAAA',
    paddingLeft: 10,
  },


  contentContainer: {
    paddingTop: 30,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
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
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  welcomeImage: {
    width: 100,
    height: 80,
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
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  botaoDownload:{
    left:'18%',
    width:230,
    height:60,
    marginTop:270,
    borderRadius:8,
  },
  textoDownload:{
    left:60,
    fontSize: 15,
    fontWeight: "bold",
    color: 'white',
  },
});
