import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

function RenderContact() {
    
    return(
        <Card title='Contact Information' >
            <View style={{margin: 10}}>
                <Text>121, Clear Water Bay Road</Text>
                <Text>Clear Water Bay, Kowloon</Text>
                <Text>HONG KONG</Text>
                <Text>Tel: +852 1234 5678</Text>
                <Text>Fax: +852 8765 4321</Text>
                <Text>Email:confusion@food.net</Text>
            </View>
        </Card>
    );
}

class Contact extends Component {

    static navigationOptions = {
        title: 'Contact Us',
    };

    render() {
        
        return(
            <ScrollView>
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                    <RenderContact />
                </Animatable.View>
            </ScrollView>
        );
    }
}


export default Contact;