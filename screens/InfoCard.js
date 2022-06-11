import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

export default class InfoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
      info_id: this.props.info.key,
      info_data: this.props.info.value,
      is_Lend : false,
      return_days: "",
      status: false,
    };
  }

  componentDidMount() {
    this.fetchTransaction();
    this.fetchLeftDays();
  }

  fetchTransaction=()=>{
    if (this.state.info_data.transaction_type === "Lend"){
      this.setState({
        is_Lend : true,
      })
    } else{
      this.setState({
        is_Lend : false,
      })
    }
  }

  fetchLeftDays=()=>{
    var currentDate = Date.now();
    var returDate = new Date(this.state.info_data.return_date);
    var difference = returDate.getTime()-currentDate;
    var difference_in_days = difference/(1000*3600*24);
    var returnDays = Math.floor(difference_in_days)+1;
    this.setState({
    return_days: returnDays,
    });
    if (Number(returnDays) > 0){
         this.setState({
           status: true
         })
    }
    else{
      this.setState({
           status: false
         })
    }
  }

  render() {
    let info = this.state.info_data;

      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            this.props.navigation.navigate("InfoScreen", {
              info: info,
              info_id:this.state.info_id
            })
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View
            style={
              this.state.light_theme
                ? styles.cardContainerLight
                : styles.cardContainer
            }
          >
          <View style={styles.titleContainer}>

           <Text style={this.state.is_Lend? styles.infoTitleText : styles.infoTitleText1}>
           {this.state.is_Lend ? "To":"From"}
           <Text style={styles.infoTitleText2}> {info.trader},</Text>
           </Text>

           <Text style={styles.typeText}>Transaction Type:
           <Text style={this.state.is_Lend? styles.typeText1 : styles.typeText2}> {info.transaction_type} </Text>
           </Text> 

           <Text style={styles.phText}>Phone No:
           <Text style={styles.phText1}> {info.phone}</Text>
           </Text> 

           <Text style={styles.amountText}>Amount {this.state.is_Lend ? "Given":"Taken"}:
           <Text style={styles.amountText1}> ${info.amount}</Text>
           </Text> 

           <Text style={styles.siText}>Simple Interest:
           <Text style={styles.siText1}> ${info.interest}</Text>
           </Text> 

           <Text style={styles.returnAmountText}>Amount to be {this.state.is_Lend ? "taken back":"given back"}:
           <Text style={styles.returnAmountText1}> ${info.return_amount}</Text>
           </Text> 

           <Text style={styles.daysText}>
           { this.state.status? 
           ("Only "+this.state.return_days+" days left"+(this.state.is_Lend ? " to borrow!":" to return!") ) 
           : "Transaction Completed!"}
           </Text> 

           <Text style={styles.knowMoreText} >More Details ---></Text>
 
          </View>
          </View>
        </TouchableOpacity>
      );
    }
  }

const styles = StyleSheet.create({
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#fff6e9",
    borderRadius: RFValue(20)
  },
  cardContainerLight: {
    marginLeft: RFValue(13),
    marginRight: RFValue(13),
    marginTop: RFValue(13),
    backgroundColor: "#fff6e9",
    borderRadius: RFValue(20),
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: RFValue(0.5),
    shadowRadius: RFValue(5),
    elevation: RFValue(2)
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  infoTitleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "green"
  },
  infoTitleText1: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "blue"
  },
  infoTitleText2: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#009999"
  },
  typeText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(19),
    color: "red"
  },
  typeText1: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18.5),
    color: "blue"
  },
  typeText2: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18.5),
    color: "green"
  },
  phText:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(19),
    color: "#8000ff"
  },
  phText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "#0080ff"
  },
  amountText:{
     fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(19),
    color: "#ffa31a"
  },
  amountText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "#ff8000"
  },
  siText:{
     fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(19),
    color: "#d580ff" 
  },
  siText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "#cc33ff"
  },
  returnAmountText:{
     fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(19),
    color: "#cc3300" 
  },
  returnAmountText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "#b32d00"
  },
  daysText:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(19),
    color: "#00c200" 
  },
  knowMoreText:{
    fontFamily: "Bubblegum-Sans",
    color: "#fffff",
    alignSelf: "center",
  },
});
