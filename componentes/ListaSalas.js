import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';

import { Text, Button } from 'native-base';
import { Feather } from '@expo/vector-icons';
export default class ListaSalas extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <FlatList style={styles.listaSalas}
                horizontal
                data={this.props.data}
                renderItem={({ item: rowData }) => {
                return (
                    <Button style={styles.salas} onPress={() => this.props.navigation.navigate('Sala', {nomeSala: rowData.titulo, patrimonios: rowData.patrimonios, ref: rowData.ref})}>
                        <Text style={styles.textSala}>{rowData.titulo}</Text>
                        <Feather name={rowData.alerta ? 'alert-triangle' : 'check-circle'} size={32} color={rowData.alerta ? 'yellow' : 'green'}  />
                    </Button>
                );
                }}
                keyExtractor={(item, index) => index}
            />  
        );
    }
}

const styles = StyleSheet.create({
    listaSalas: {
        margin: 5,
        height: 100, /** 15% */
    },
    salas: {
        backgroundColor: '#383276',
        height: '90%',
        paddingRight: 15,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    textSala: {
        fontSize: 18,
        fontWeight: "bold",
    },
    estadoSala: {
        borderLeftColor: '#707070',
        borderStyle: "solid",
    },
    verde: {
        color:"#128300"
    },
});
