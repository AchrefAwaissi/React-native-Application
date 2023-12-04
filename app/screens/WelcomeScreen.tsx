import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";
import AppButton from "../components/AppButton";
import SignIn from "../pages/SignIn";  
import SignUp from "../pages/SignUp";  
import {  useNavigation } from "@react-navigation/native";

interface WelcomeScreenProps {

}

function WelcomeScreen(props: WelcomeScreenProps) {
  const navigation = useNavigation();
  const handleLoginPress = () => {
    // Logique pour gérer le clic sur le bouton de connexion
    console.log("Login button pressed");
    navigation.navigate('SignIn');
  };

  const handleRegisterPress = () => {
    // Logique pour gérer le clic sur le bouton d'inscription
    console.log("Register button pressed");
    navigation.navigate('SignUp');
  };

  return (
    <ImageBackground blurRadius={1} style={styles.background}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo.png")}/>
        <Text style={styles.tagline}>Sell What You Don't Need</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {/* Rendre le composant SignIn sur le clic du bouton de connexion */}
        <AppButton title="Login" onPress={handleLoginPress}>
          <SignIn onPress={handleLoginPress} />
        </AppButton>

        {/* Rendre le composant SignUp sur le clic du bouton d'inscription */}
        <AppButton title="Register" color="secondary" onPress={handleRegisterPress}>
          <SignUp onPress={handleRegisterPress} />
        </AppButton>
      </View>
    </ImageBackground>
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
    width: 100,
    height: 100,
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
