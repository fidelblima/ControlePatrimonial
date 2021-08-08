import * as React from 'react';
import { Text, StyleSheet, Picker } from 'react-native';
import Modal, { ModalContent, ModalTitle,
    ModalFooter, ModalButton, SlideAnimation } from 'react-native-modals';

export default class PatrimonioLido extends React.Component {

 /**
  * Props:
  * Visivel: Exibir ou nao Modal
  * changeVisibilidade: Alternar visibilidade do Modal
  * descricaoPatrimonioLido: Nome do Patrimonio
  * descricacoPatrimonioLido: Descrição do Patrimonio
  * sala: Nome da sala do Patrimonio
  * estado: Estado atual do Patrimonio
  * codigo: Codigo do Patrimonio
  */

  constructor(props){
    super(props);
    this.state = {
      estado: null,
    }
  }

  changeVisibilidade(){
      this.props.changeVisibilidade();
  }

  render() {

    if(this.props.encontrado){
      return (
        <Modal
          visible={this.props.visivel}
          rounded={true}
          modalAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
          modalTitle={<ModalTitle title={this.props.nomePatrimonioLido} />}
          footer={
          <ModalFooter>
            <ModalButton
                text="SALVAR"
                onPress={() => {
                  this.changeVisibilidade();
                  let novaSituacao = this.state.estado == null ? this.props.estado : this.state.estado;
                  let idPatrimonio = this.props.idPatrimonio;
                  this.props.salvarAlteracaoPatrimonio(novaSituacao, idPatrimonio);
                }}
            />
          </ModalFooter>}
        >
          <ModalContent>
            <Text style={styles.negrito}>Descrição:</Text>
            <Text> {this.props.descricaoPatrimonioLido}</Text>
            <Text style={styles.negrito}>Sala:</Text>
            <Text> {this.props.sala}</Text>
            <Text style={styles.negrito}>Código:</Text>
            <Text> {this.props.codigo}</Text>


            <Text style={styles.negrito}>Estado:</Text>
            <Picker
              selectedValue={this.state.estado ? this.state.estado : this.props.estado}
              style={{ height: 50, width: 300 }}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ estado: itemValue });
              }}>
              <Picker.Item label="Bom" value="Bom" />
              <Picker.Item label="Ruim" value="Ruim" />
              <Picker.Item label="Indefinido" value="Indefinido" />
            </Picker>
          </ModalContent>
        </Modal>
      );
    }else{
      return (
        <Modal
          visible={this.props.visivel}
          rounded={true}
          modalAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
          modalTitle={<ModalTitle title="NÃO ENCONTRADO" />}
          footer={
          <ModalFooter>
            <ModalButton
                text="RETORNAR"
                onPress={() => this.changeVisibilidade()}
            />
          </ModalFooter>}
        >
          <ModalContent>
            <Text style={styles.msg}> O código: {this.props.codigo} não consta nesta sala. Por favor consulte o administrador para mais informações.</Text>
          </ModalContent>
        </Modal>
      );
    }
  } 
}

const styles = StyleSheet.create({
  negrito: {
    paddingTop: 20,
    fontWeight: 'bold',
  },
  msg: {
    textAlign: 'center',
    padding: 10,
  }
});
