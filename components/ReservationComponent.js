import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            show: false,
            mode: "date",
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation OK?',
            `Number of guests: ${this.state.guests}\nSmoking? ${this.state.smoking ? 'Yes' : 'No'}\nDate:${this.state.date.toDateString()}\nTime:${this.state.date.toTimeString()}`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => this.resetForm(),
              },
              {
                text: 'OK',
                onPress: () => { this.presentLocalNotification(this.state.date), this.addReservationToCalendar(this.state.date), this.resetForm(), this.toggleModal() },
              },
            ],
            { cancelable: false },
          );
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            show: false,
            mode: "date",
            showModal: false
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    static async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to access the calendar');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async addReservationToCalendar(date) {
        await Reservation.obtainCalendarPermission();
        const startDate = new Date(Date.parse(date));
        const endDate = new Date(Date.parse(date) + (2 * 60 * 60 * 1000)); // 2 hours
        Calendar.createEventAsync(
            Calendar.DEFAULT,
            {
                title: 'Con Fusion Table Reservation',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
                startDate,
                endDate,
                timeZone: 'Asia/Hong_Kong',
            },
        );
        Alert.alert('Reservation has been added to your calendar');
    }

    render() {
        const showDatepicker = () => {
            this.setState({ show: true });
        };
        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            trackColor='#512DA8'
                            onValueChange={(value) => this.setState({smoking: value})}
                        >
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <Text style={styles.formItem} onPress={showDatepicker}>
                            {this.state.date.toDateString()} {this.state.date.toTimeString()}
                        </Text>
                        {this.state.show && (
                        <DateTimePicker
                            style={{flex: 2, marginRight: 20}}
                            value={this.state.date}
                            mode={this.state.mode}
                            placeholder="Select Date And Time"
                            minimumDate={new Date()}
                            onChange={(value) => {
                                if (value !== undefined) {
                                    this.setState({
                                        show: this.state.mode === "time" ? false : true,
                                        mode: "time",
                                        date: new Date(value.nativeEvent.timestamp)
                                    });   
                                }
                                else {
                                    this.setState({ show: false });
                                }
                            }}
                        />
                        )}
                    </View>
                    <View style={styles.formRow}>
                        <Button onPress={() => this.handleReservation()} title="Reserve" color="#512DA8" accessibilityLabel="Learn More About This Purple Button" />
                    </View>
                </Animatable.View>
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }
                >
                    <View style = {styles.modal}>
                        <Text style = {styles.modalTitle}>Your Reservation</Text>
                        <Text style = {styles.modalText}>Number of Guests: {this.state.guests}</Text>
                        <Text style = {styles.modalText}>Smoking?: {this.state.smoking ? 'Yes' : 'No'}</Text>
                        <Text style = {styles.modalText}>Date: {this.state.date.toDateString()}</Text>
                        <Text style = {styles.modalText}>Time: {this.state.date.toTimeString()}</Text>
                        <Button onPress = {() =>{this.toggleModal(); this.resetForm();}} color="#512DA8" title="Close" />
                    </View>
                </Modal>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;