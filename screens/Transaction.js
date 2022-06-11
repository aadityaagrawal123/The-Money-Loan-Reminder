import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Button,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/Feather';
import * as Font from "expo-font";
import firebase from "firebase";


export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownHeight: 50,
      transaction: "Lend",
    };
  }

async addInfo() {

  var date = this.state.date.trim();
  var return_date = this.state.return_date.trim();
  var amount = this.state.amount.trim();
  var rate = this.state.rate.trim();
  var final_date = new Date(date);
  var final_return_date = new Date(return_date);
  var the_trader = this.state.trader.toUpperCase();

  const difference = final_return_date.getTime()-final_date.getTime();
  const num_days = difference/(1000*3600*24);
  const si = amount*num_days*rate/36500;
  const simple_interest = Math.floor(si)+1;
  const back_amount = Number(amount) + simple_interest;
  const transactionID = Math.random().toString(36).slice(2);

    if (
      the_trader &&
      this.state.trader &&
      this.state.phone &&
      this.state.date &&
      this.state.return_date &&
      this.state.amount &&
      this.state.rate &&
      this.state.caption &&
      simple_interest &&
      back_amount
    ) {
      let infoData = {
        transaction_type: this.state.transaction,
        trader : this.state.trader,
        trader_for_search: the_trader,
        phone  : this.state.phone,
        date   : date,
        return_date : return_date,
        amount : amount,
        rate   : rate,
        caption: this.state.caption,
        interest : simple_interest,
        return_amount : back_amount,
        created_on: new Date(),
        person : firebase.auth().currentUser.displayName,
        person_uid: firebase.auth().currentUser.uid,
        transaction_id: transactionID,
      };

      Alert.alert("Submitted Successfully!");
      this.props.navigation.navigate("History");

      this.setState({
      transaction: "Lend",
      trader : "",
      phone : "",
      date : "",
      return_date : "",
      amount : "",
      rate : "",
      caption : ""
      });
      
      await firebase
        .database()
        .ref(
          "/transactions/" +
           transactionID
        )
        .set(infoData)
        .then(function(snapshot) {});
      this.props.setUpdateToTrue();

    } else {
       Alert.alert(
        "Error",
        "All fields are required!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      this.setState({
      transaction: "Lend",
      trader : "",
      phone : "",
      date : "",
      return_date : "",
      amount : "",
      rate : "",
      caption : ""
      });
    }
  }

  render() {
      return (
      <View style={styles.container}>
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/applogo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={ styles.appTitleText}>Transaction</Text>
            </View>
          </View>
          
          <View style={styles.fieldsContainer}>
           <ScrollView>

            <View style={{ marginTop:20, height: RFValue(this.state.dropdownHeight) }}>
            <DropDownPicker
                items={[
                  { label: "Lend", value: "Lend"},
                  { label: "Borrow", value: "Borrow"},
                ]}
                defaultValue={this.state.transaction}
                containerStyle={{
                  borderWidth: 2,
                  borderColor: "#c99789",
                  height : 50,
                  marginBottom: RFValue(20),
                  borderRadius: RFValue(10),
                }}
                onOpen={() => {
                  this.setState({ dropdownHeight: 100 });
                }}
                onClose={() => {
                  this.setState({ dropdownHeight: 50 });
                }}
                style={{backgroundColor: "#fff4e6"}}
                itemStyle={{
                    justifyContent: "flex-start"
                }}
                dropDownStyle={{
                    backgroundColor: "#fff4e6",
                    borderRadius : 10,
                    borderWidth: 2,
                    borderColor: "#c99789",
                }}
                labelStyle={styles.dropdownLabelLight}
                textStyle={{
                  color:"black",
                  fontFamily: "Bubblegum-Sans",
                }}
                arrowStyle={styles.dropdownLabelLight}
                onChangeItem={item =>
                  this.setState({
                    transaction: item.value,
                  })
                }
              />
            </View>

              <View style={{ marginTop:25, }} >
                <TextInput
                  style={styles.inputFont}
                  onChangeText={trader => this.setState({trader})}
                  placeholder={"Initiated To"}
                  placeholderTextColor={"black"}/>
                </View>

                <View style={{ marginTop:25, }} >
                <TextInput
                  style={styles.inputFont}
                  onChangeText={phone => this.setState({phone})}
                  placeholder={"Phone number of the initiator (eg: +91 1234567XXX)"}
                  placeholderTextColor={"black"}/>
                </View>

              <View style={{ marginTop:25, }} >
                <TextInput
                  style={styles.inputFont}
                  onChangeText={date => this.setState({date})}
                  placeholder={"Date of Initiation       (format: MM/DD/YYYY)"}
                  placeholderTextColor={"black"}/>
                </View>

              <View style={{ marginTop:25, }} >
                <TextInput
                  style={styles.inputFont}
                  onChangeText={return_date => this.setState({return_date})}
                  placeholder={"Due Date of Return  (format: MM/DD/YYYY)"}
                  placeholderTextColor={"black"}/>
                </View>

              <View style={{marginTop:25}} >
                <TextInput
                  style={styles.inputFont}
                  onChangeText={amount => this.setState({amount})}
                  placeholder={"Amount [only in number format] (eg: 100000)"}
                  placeholderTextColor={"black"}/>
                </View>

                <View style={{ marginTop:25, }} >
                <TextInput
                  style={styles.inputFont}
                  onChangeText={rate => this.setState({rate})}
                  placeholder={"Rate of Interest per Annum (number format only)"}
                  placeholderTextColor={"black"}/>
                </View>

               <View style={{ marginTop:25 }} >
                <TextInput
                  style={styles.inputFont}
                  onChangeText={caption => this.setState({caption})}
                  placeholder={"Any Caption Here"}
                  placeholderTextColor={"black"}/>
                </View>

                <View style={styles.submitButton}>
                <Button
                  onPress={() => this.addInfo()}
                  title="Submit"
                  color="#841584"
                />
              </View>
          </ScrollView>
           </View>
        <View style={{ flex: 0.05 }} />
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf0e6"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(5)
  },
  appTitle: {
    flex: 0.06,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 1,
    justifyContent: "center"
  },
  appTitleText: {
    color: "#00ae00",
    fontSize: RFValue(32),
    fontFamily: "Bubblegum-Sans",
    fontWeight : "bold",
  },
  fieldsContainer: {
    flex: 0.85
  },
  inputFont: {
    height: RFValue(40),
    borderColor: "#c99789",
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "black",
    fontFamily: "Bubblegum-Sans",
    backgroundColor: "#fff6e9",
  },
  dropdownLabelLight: {
    color: "black",
    marginHorizontal : RFValue(8),
    fontFamily: "Bubblegum-Sans"
  },
  submitButton: {
    marginTop: RFValue(25),
    alignItems: "center",
    justifyContent: "center"
  }
});