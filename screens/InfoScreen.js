import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';


export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakerColor: 'gray',
      speakerIcon: 'volume-high-outline',
      light_theme: true,
      is_Lend : false,
      return_days: "",
      status: false,
      date:"",
      date_day : "",
      return_date:"",
      return_day:"",
    };
  }

   componentDidMount() {
    this.fetchTransaction();
    this.fetchLeftDays();
    this.showDate();
  }

  fetchTransaction=()=>{
    if (this.props.route.params.info.transaction_type === "Lend"){
      this.setState({
        is_Lend : true,
      })
    } else{
      this.setState({
        is_Lend : false,
      })
    }
  }

  showDate=()=>{

    var db_date = this.props.route.params.info.date;
    var db_return_date = this.props.route.params.info.return_date;

    const month = 
  ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date(db_date);
    let month_name = month[d.getUTCMonth()];
    const r_d = new Date(db_return_date);
    let r_month_name = month[r_d.getUTCMonth()];

    var split_date1 =  db_date.slice(3,5);
    var split_date2 =  month_name;
    var split_date3 =  db_date.slice(6,10);
    var the_date1 = split_date1.concat(" ", split_date2);
    var the_date = the_date1.concat(" ", split_date3);

    var r_date1 =  db_return_date.slice(3,5);
    var r_date2 =  r_month_name;
    var r_date3 =  db_return_date.slice(6,10);
    var return_date1 = r_date1.concat(" ", r_date2);
    var returnDate = return_date1.concat(" ", r_date3);

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d_date = new Date(db_date);
    var day = weekday[d_date.getUTCDay()];
    const r_d_date = new Date(db_return_date);
    var returnDay = weekday[r_d_date.getUTCDay()];

     this.setState({
      date: the_date,
      date_day: day,
      return_date: returnDate,
      return_day: returnDay,
    })
  }

  fetchLeftDays=()=>{
    var currentDate = Date.now();
    var returDate = new Date(this.props.route.params.info.return_date);
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
    let info = this.props.route.params.info;
    var date = `\n${this.state.date} (${this.state.date_day})`;
    var return_date = `\n${this.state.return_date} (${this.state.return_day})`;
    var caption = `\n${info.caption}`;
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/applogo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={styles.appTitleText}>
                Information
              </Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView
              style={
                this.state.light_theme
                  ? styles.storyCardLight
                  : styles.storyCard
              }>
                <TouchableOpacity style={styles.backcontainer} 
                onPress={() => this.props.navigation.navigate("Home")}>
                <Icon name="arrow-left-circle" size={18} color="#900" />
                <Text style={{color: "gray"}} > Back</Text>
                </TouchableOpacity>

          <View style={styles.dataContainer}>

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

           <Text style={styles.rateText}>Rate of Interest:
           <Text style={styles.rateText1}> {info.rate}%</Text>
           </Text> 

           <Text style={styles.siText}>Simple Interest:
           <Text style={styles.siText1}> ${info.interest}</Text>
           </Text> 

           <Text style={styles.returnAmountText}>Amount to be {this.state.is_Lend ? "taken back":"given back"}:
           <Text style={styles.returnAmountText1}> ${info.return_amount}</Text>
           </Text> 

           <Text style={styles.dText}>Date of Initiation:
           <Text style={styles.dText1}>{date}</Text>
           </Text>

           <Text style={styles.rdText}>Date of Return:
           <Text style={styles.rdText1}>{return_date}</Text>
           </Text>                                        

           <Text style={styles.captionText}>Caption:
           <Text style={styles.captionText1}>{caption}</Text>
           </Text> 

           <Text style={styles.transText}>Transaction ID:
           <Text style={styles.transText1}> {info.transaction_id}</Text>
           </Text> 

           <Text style={styles.statusText}>Current Status:
           <Text style={styles.statusText1}>{this.state.status ? " Active":" Inactive"}</Text>
           </Text> 

           <Text style={styles.daysText}>
           { this.state.status? 
           ("Only "+this.state.return_days+" days left"+(this.state.is_Lend ? " to borrow!":" to return!") ) 
           : "Transaction Completed!"}
           </Text> 
 
          </View>

            </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf0e6',
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#faf0e6',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
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
  storyContainer: {
    flex: 1,
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: '#fff6e9',
    borderRadius: RFValue(20),
  },
  storyCardLight: {
    margin: RFValue(20),
    backgroundColor: '#fff6e9',
    borderRadius: RFValue(20),
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  dataContainer: {
    flexDirection: 'row',
    padding: RFValue(20),
  },
  backcontainer:{
    width: RFValue(60),
    backgroundColor: "#ccff33",
    flexDirection: "row",
    borderRadius: RFValue(10),
    paddingLeft: RFValue(5),
    height: RFValue(25),
    alignItems: "center",
    marginTop: RFValue(5),
    marginLeft: RFValue(5),
  },
   infoTitleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(27),
    color: "green"
  },
  infoTitleText1: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(27),
    color: "blue"
  },
  infoTitleText2: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(27),
    color: "#009999"
  },
  typeText: {
    marginTop: RFValue(8),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "red"
  },
  typeText1: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "blue"
  },
  typeText2: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "green"
  },
  phText:{
    marginTop: RFValue(4),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#8000ff"
  },
  phText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#0080ff"
  },
  amountText:{
     marginTop: RFValue(4),
     fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#33d6ff"
  },
  amountText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#00ccff"
  },
  siText:{
     marginTop: RFValue(4),
     fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#d580ff" 
  },
  siText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#cc33ff"
  },
  rateText:{
     marginTop: RFValue(4),
     fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#ff1ab3" 
  },
  rateText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#e60099"
  },
  returnAmountText:{
     marginTop: RFValue(4),
     fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#cc3300" 
  },
  returnAmountText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#b32d00"
  },
  daysText:{
    marginTop: RFValue(4),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#00c200" 
  },
   dText:{
    marginTop: RFValue(4),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#ff704d" 
  },
  dText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#ff471a"
  },
  rdText:{
    marginTop: RFValue(4),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#ffb31a"
  },
  rdText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#ffaa00"
  },
  captionText:{
    marginTop: RFValue(4),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#00b3b3"
  },
  captionText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#009999"
  },
  transText:{
    marginTop: RFValue(4),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#004d99" 
  },
  transText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#004080"
  },
  statusText:{
    marginTop: RFValue(4),
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(22),
    color: "#cc9900"
  },
  statusText1:{
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(21),
    color: "#b38600" 
  },
});
