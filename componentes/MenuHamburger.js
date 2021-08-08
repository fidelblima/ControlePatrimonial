import React from 'react';
import { View, Text } from 'react-native';

export default class MenuHamburger extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return (
            <View style={{backgroundColor: "white", alignSelf: "flex-end", flexDirection: 'column', padding: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}>
                <Text onPress={() => this.props.acao()} >{this.props.texto}</Text>
            </View>
        );
    }
}
