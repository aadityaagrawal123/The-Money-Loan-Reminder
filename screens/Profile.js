import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_image: "",
      name: "",
      is_liked : false,
      likes: "",
      is_disliked : false,
      dislikes : "",
    };
  }

  componentDidMount() {
    this.fetchUser();
    this.fetchRatings();
  }

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref("rating")
        .child("likes")
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes - 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref("rating")
        .child("likes")
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes + 1), is_liked: true });
    }
  };

  dislikeAction = () => {
    if (this.state.is_disliked) {
      firebase
        .database()
        .ref("rating")
        .child("dislikes")
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ dislikes: (this.state.dislikes - 1), is_disliked: false });
    } else {
      firebase
        .database()
        .ref("rating")
        .child("dislikes")
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ dislikes: (this.state.dislikes + 1), is_disliked: true });
    }
  };

  async fetchUser() {
    let theme, name, image;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function (snapshot) {
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
        image = snapshot.val().profile_picture;
      });
    this.setState({
      name: name,
      profile_image: image
    });
  }

   async fetchRatings() {
    let num_likes, num_dislikes;
    await firebase
      .database()
      .ref("rating")
      .on("value", function (snapshot) {
        num_likes = snapshot.val().likes;
        num_dislikes = snapshot.val().dislikes;
      });
    this.setState({
      likes: num_likes,
      dislikes: num_dislikes,
    });
  }

  render() {
      return (
        <View
          style={styles.containerLight}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/applogo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={styles.appTitleTextLight}>
                Money Loan App
              </Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: this.state.profile_image }}
                style={styles.profileImage}
              ></Image>
              <Text
                style={styles.nameTextLight}>
                {this.state.name}
              </Text>

               <View style={{justifyContent: "flex-end", backgroundColor: "#e7d3d3",
               marginTop: 50, borderRadius:10, borderWidth:2, borderColor:"brown", alignItems: "center" }} >
              <Text style={styles.ratetext} >Rate Us !</Text>

             <View style={styles.ratingButtons}>
               <TouchableOpacity
                style={
                  this.state.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }
                onPress={() => this.likeAction()}
              >
                <Ionicons
                  name={"heart"}
                  size={RFValue(30)}
                  color={this.state.light_theme ? "black" : "white"}
                />

                <Text style={styles.likeTextLight}>{this.state.likes}</Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={
                  this.state.is_disliked
                    ? styles.dislikeButtonLiked
                    : styles.dislikeButtonDisliked
                }
                onPress={() => this.dislikeAction()}
              >
                <Ionicons
                  name={"heart-dislike"}
                  size={RFValue(30)}
                  color={this.state.light_theme ? "black" : "white"}
                />

                <Text style={styles.dislikeTextLight}>{this.state.dislikes}</Text>

              </TouchableOpacity>
              </View>
            </View>
            </View>
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor :"#faf0e6",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  ratingButtons:{
     flexDirection: "row",
     marginBottom: 10,
     marginLeft : RFValue(8),
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
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleTextLight: {
    color: "#00ae00",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  screenContainer: {
    flex: 0.95
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70),
    marginTop: 25,
  },
  nameTextLight: {
    color: "black",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  ratetext:{
    color: "#c99789",
    fontSize: 25,
  },
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30),
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#eb3948",
    borderWidth: 2,
    borderRadius: RFValue(30),
  },
  likeTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6
  },
   dislikeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#89CFF0",
    borderRadius: RFValue(30),
  },
  dislikeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#89CFF0",
    borderWidth: 2,
    borderRadius: RFValue(30)
  },
  dislikeTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6
  }
});