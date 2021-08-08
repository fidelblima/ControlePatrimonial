import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { Header, Left, Body, Title, Button as BotaoHeader, Icon  } from 'native-base';

import ModalPatrimonioLido from './modals/PatrimonioLido';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

let db = firebase.firestore();

export default class Camera extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      hasCameraPermission: null,
      scanned: false,
      modalVisivel: false,

      keyPatrimonioSelecionado: 0,
  
      nomePatrimonioLido: '',
      descricaoPatrimonioLido: '',
      sala: '',
      estado: '',
      codigo: '',
      encontrado: false,

      ref: this.props.navigation.state.params.ref,
      categorias: [],
    };

    this.changeModalVisible = this.changeModalVisible.bind(this);
    this.pegarDados = this.pegarDados.bind(this);
  }

  async componentDidMount() {
    this.getPermissionsAsync();
    let refCategoria = this.props.navigation.state.params.ref;
      
    await refCategoria.get().then(async (snapshot) => {
      await this.setState({categorias: snapshot.data()});
    });
    
  }

  pegarDados(codigo){
    let categoria = this.state.categorias;
    let nomeSala = this.props.navigation.state.params.nomeSala;

    let salas = categoria.salas;
    salas.forEach((sala) => {
      if(sala.nome === nomeSala){
        let patrimonios = sala.patrimonios;
        patrimonios.forEach(async (patrimonio, key) => {
          if(patrimonio.codigo === codigo){
            await this.setState({
              keyPatrimonioSelecionado: key,
              nomePatrimonioLido: patrimonio.nome,
              descricaoPatrimonioLido: patrimonio.descricao,
              sala: sala.nome,
              estado: patrimonio. situacao,
              codigo: patrimonio.codigo,
              encontrado: true,
            });
          }
        });
      }
    });
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  changeModalVisible(){
    let modalVisivel = !this.state.modalVisivel;
    this.setState({modalVisivel});
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Solicitando acesso a Câmera</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Sem acesso a Câmera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#3F51B5'
        }}>

        <Header noShadow>
          <Left>
            <BotaoHeader transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' />
            </BotaoHeader>
          </Left>
          <Body style={{
            marginLeft: -35,
          }}>
            <Title>Escanei o código de barras</Title>
          </Body>
        </Header>

        <View 
          style={{
            flex: 1,
            justifyContent: "flex-end"
          }}> 
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />

          {scanned && (
            <Button
              title={'Toque para escanear novamente'}
              onPress={() => this.setState({ scanned: false })}
            />
          )}
        </View>

        <ModalPatrimonioLido
          visivel={this.state.modalVisivel}
          changeVisibilidade={this.changeModalVisible}
          nomePatrimonioLido={this.state.nomePatrimonioLido}
          descricaoPatrimonioLido={this.state.descricaoPatrimonioLido}
          sala={this.state.sala}
          estado={this.state.estado}
          codigo={this.state.codigo}
          encontrado={this.state.encontrado}
          salvarAlteracaoPatrimonio={this.props.navigation.state.params.salvarAlteracaoPatrimonio}
          idPatrimonio={this.state.keyPatrimonioSelecionado}
        />
      </View>
    );
  }

  handleBarCodeScanned = async ({ type, data }) => {
    await this.setState({ scanned: true, codigo: data, encontrado: false });
    this.pegarDados(data);
    this.changeModalVisible();
  };
  
}