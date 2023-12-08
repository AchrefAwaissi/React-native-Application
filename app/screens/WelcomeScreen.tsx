import React from "react";
import { StyleSheet, View, Image } from "react-native";
import AppButton from "../components/AppButton";
import SignIn from "../pages/SignIn";  
import SignUp from "../pages/SignUp";  
import {  useNavigation } from "@react-navigation/native";

interface WelcomeScreenProps {

}

function WelcomeScreen(props: WelcomeScreenProps) {
  const navigation = useNavigation();
  const handleLoginPress = () => {
    navigation.navigate('SignIn' as never);
  };

  const handleRegisterPress = () => {
    navigation.navigate('SignUp' as never);
  };

  return (
    <View  style={styles.background}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/welcome.png")}/>
      </View>
      <View style={styles.buttonsContainer}>
        <AppButton title="Login" onPress={handleLoginPress}>
          <SignIn onPress={handleLoginPress} />
        </AppButton>

        <AppButton title="Register" color="secondary" onPress={handleRegisterPress}>
          <SignUp onPress={handleRegisterPress} />
        </AppButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 340,
    height: 300,

  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagline: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 20,
  },
});

export default WelcomeScreen;
