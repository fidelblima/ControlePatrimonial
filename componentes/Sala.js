import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {Container, Header, Text, Left, Body, Title, Button, Icon  } from 'native-base';

import ModalPatrimonioLido from './modals/PatrimonioLido';

import { Feather } from '@expo/vector-icons';

import 'firebase/firestore';

export default class Sala extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nomeSala: this.props.navigation.state.params.nomeSala,
            patrimonios: this.props.navigation.state.params.patrimonios,
            ref: this.props.navigation.state.params.ref,
            modalVisivel: false,

            nomePatrimonioLido: '',
            descricaoPatrimonioLido: '',
            sala: '',
            estado: '',
            codigo: '',

            keyPatrimonioSelecionado: 0,
        }
        this.changeModalVisible = this.changeModalVisible.bind(this);
        this.pegarDadosMostrarModal = this.pegarDadosMostrarModal.bind(this);
        this.salvarAlteracaoPatrimonio = this.salvarAlteracaoPatrimonio.bind(this);
    }

    mostrarPatrimonios(){
      let patrimonios = this.state.patrimonios;

      return patrimonios.map( (patrimonio, key) =>{
        let styleSituacao;
        let iconeSituacaoBotao;

        if(patrimonio.situacao === 'Indefinido'){
          styleSituacao = styles.styleSituacaoBotaoIndefinido;
          iconeSituacaoBotao = 'minus';
        }else if (patrimonio.situacao === 'Bom'){
          styleSituacao = styles.styleSituacaoBotaoBom;
          iconeSituacaoBotao = 'check';
        }else{
          styleSituacao = styles.styleSituacaoBotaoRuim;
          iconeSituacaoBotao = 'x';
        }
        
        return (
          <View style={styles.rowContainer} key={key}>
            <View style={styles.patrimonio}>
              <Button style={styles.botaoPatrimonio} info onPress={() => this.pegarDadosMostrarModal(patrimonio, key)}>
                <Text style={styles.textoPatrimonio}>{patrimonio.nome + '\n' + patrimonio.codigo}</Text>
              </Button>
              <Button style={styleSituacao} onPress={() => this.pegarDadosMostrarModal(patrimonio, key)}>
                <Feather name={iconeSituacaoBotao}/>
              </Button>
            </View>
          </View>
        );
      });
    }
    
    async pegarDadosMostrarModal(patrimonio, keyPatrimonioSelecionado){
      await this.setState({
        nomePatrimonioLido: patrimonio.nome,
        descricaoPatrimonioLido: patrimonio.descricao,
        sala: this.state.nomeSala,
        estado: patrimonio.situacao,
        codigo: patrimonio.codigo,
        keyPatrimonioSelecionado
      });

      this.changeModalVisible();
    }

    changeModalVisible(){
      let modalVisivel = !this.state.modalVisivel;
      this.setState({modalVisivel});
    }

    async salvarAlteracaoPatrimonio(novaSituacao, idPatrimonio){
      let refCategoria = this.props.navigation.state.params.ref;
      
      await refCategoria.get().then(async (snapshot) => {
        let categoria = snapshot.data();
        let salas = categoria.salas;

        let patrimonios = [];

        salas.forEach((sala) => {
          if(sala.nome === this.state.nomeSala){
            sala.patrimonios[idPatrimonio].situacao = novaSituacao;
            patrimonios = sala.patrimonios;
          }
        });

        this.setState({patrimonios});

        categoria.salas = salas;
        await refCategoria.update(categoria);
        this.render();
      });
    }

    render(){
        return(
            <Container style={styles.mainContainer}>
              <Header>
                  <Left>
                  <Button transparent onPress={() => this.props.navigation.goBack()}>
                      <Icon name='arrow-back' />
                  </Button>
                  </Left>

                  <Body>
                      <Title>{this.state.nomeSala}</Title>
                  </Body>
              </Header>

              <Button style={styles.botaoCamera}
              onPress={() => this.props.navigation.navigate('Camera', {ref: this.state.ref, nomeSala: this.state.nomeSala, salvarAlteracaoPatrimonio:this.salvarAlteracaoPatrimonio})}>
                  <Icon name="camera" android="md-camera" ios="ios-camera"/>
              </Button>

              {this.mostrarPatrimonios()}
                
              <View style={styles.fixoBaixo}>
                <Button style={styles.botaoSalvar}
                onPress={() => this.props.navigation.goBack()}>
                  <Text style={styles.textoBtnSalvar}>Concluir</Text>
                </Button>
              </View>

              <ModalPatrimonioLido
                  visivel={this.state.modalVisivel}
                  changeVisibilidade={this.changeModalVisible}
                  nomePatrimonioLido={this.state.nomePatrimonioLido}
                  descricaoPatrimonioLido={this.state.descricaoPatrimonioLido}
                  sala={this.state.sala}
                  estado={this.state.estado}
                  codigo={this.state.codigo}
                  encontrado={true}
                  salvarAlteracaoPatrimonio={this.salvarAlteracaoPatrimonio}
                  idPatrimonio={this.state.keyPatrimonioSelecionado}
                />
            </Container>
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
    paddingTop: 10,
    justifyContent: 'center',
  },
  botaoCamera: {
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  fixoBaixo: {
    flex: 1,
    justifyContent: "flex-end",
  },
  botaoSalvar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 10,
  },
  textoBtnSalvar: {
    fontSize: 15,
    fontWeight: "bold",
    color: 'white',
  },
  patrimonio: {
    flexDirection: 'row',
    marginTop: 15,
    width: '80%',
    justifyContent: 'center',
  },
  botaoPatrimonio: {
    flex: 7,
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  styleSituacaoBotaoIndefinido: {
    flex: 2,
    backgroundColor: '#3A3644',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  styleSituacaoBotaoBom: {
    flex: 2,
    backgroundColor: '#28794B',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  styleSituacaoBotaoRuim: {
    flex: 2,
    backgroundColor: '#983352',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  textoPatrimonio: {
    paddingLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: 'white',
    textAlign: 'center',
  },
  iconeEstadoPatrimonio: {
    backgroundColor: 'white',
    height: 44,
    width: 70,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    justifyContent: 'center',
  },
  textoIconePatrimonio: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  salas: {
    margin: 5,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
});
