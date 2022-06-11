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
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RFValue } from "react-native-responsive-fontsize";
import InfoCard from "./InfoCard";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Feather';
import firebase from "firebase";

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
    infos: [],
    searchText: "",
    };
  }

  handleSearch = async text => {
    var enteredText = text.toUpperCase();
    text = text.toUpperCase();

    this.setState({
      infos: []
    });

    if (!enteredText || !text) {
      this.fetchInfos();
    }

    let infosRef = firebase.database().ref('transactions'); 
    let person_uid_ref = infosRef.orderByChild("person_uid").equalTo(firebase.auth().currentUser.uid)
    let search_person_name = infosRef.orderByChild("trader_for_search").equalTo(enteredText)

      person_uid_ref && search_person_name.on(
        "value",
        snapshot => {
          let infos = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              infos.push({
                key: key,
                value: snapshot.val()[key]
              });
            });
          }
          this.setState({ infos: infos });
   //       this.props.setUpdateToFalse();
        },
        function (errorObject) {
        }
      );

  };

    fetchInfos = () => {
     let infosRef = firebase.database().ref('transactions'); 
      infosRef.limitToLast(25).orderByChild("person_uid").equalTo(firebase.auth().currentUser.uid)
      .on(
        "value",
        snapshot => {
          let infos = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              infos.push({
                key: key,
                value: snapshot.val()[key]
              });
            });
          }
          this.setState({ infos: infos });
   //       this.props.setUpdateToFalse();
        },
        function (errorObject) {
        }
      );
  };

  componentDidMount() {
   this.fetchInfos();
  }

  renderItem = ({ item: info }) => {
    return <InfoCard info={info} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

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
              <Text style={ styles.appTitleText}>History</Text>
            </View>
            <TouchableOpacity style={styles.backcontainer} 
                onPress={() =>{this.fetchInfos()}}>
                <Icon name="refresh-cw" size={18} color="#900" />
                <Text style={{color: "gray"}} > Refresh</Text>
                </TouchableOpacity>
          </View>

         <View style={styles.upperContainer}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({searchText: text})}
              placeholder={"Name of Payee"}
              placeholderTextColor={"#FFFFFF"}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => this.handleSearch(this.state.searchText)}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

          {!this.state.infos[0] ? (
            <View style={styles.noinfos}>
            <Text style={styles.noinfosText}>No Information !</Text>
            </View>
            ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.infos}
                renderItem={this.renderItem}
              />
            </View>
          )}

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
    justifyContent: "center",
  },
  appTitleText: {
    color: "#00ae00",
    fontSize: RFValue(32),
    fontFamily: "Bubblegum-Sans",
    fontWeight : "bold",
  },
   upperContainer: {
    flex: 0.13,
    justifyContent: "center",
    alignItems: "center"
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF"
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Bubblegum-Sans",
    color: "#FFFFFF"
  },
  searchButton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  searchButtonText: {
    fontSize: 24,
    color: "#0A0101",
    fontFamily: "Bubblegum-Sans",
  },
   noinfos: {
    flex: 0.5,
    alignItems: "center"
  },
  noinfosText: {
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.9,
  },
  backcontainer:{
    width: RFValue(77),
    backgroundColor: "#b3d9ff",
    flexDirection: "row",
    borderRadius: RFValue(10),
    paddingLeft: RFValue(5),
    height: RFValue(25),
    alignItems: "center",
    marginTop: RFValue(5),
    marginRight: RFValue(10),
  },
})