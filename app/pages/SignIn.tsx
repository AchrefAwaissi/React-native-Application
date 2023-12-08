import React from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { firebaseConfig } from "../config/config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AppButton from "../components/AppButton";
import Icon from 'react-native-vector-icons/FontAwesome'; 

import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import colors from "../config/colors";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const SignIn = () => {
  const { signIn } = useAuth();

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const handleSignIn = (
    values: { email: string; password: string },
    { setSubmitting }: any
  ) => {
    setSubmitting(false);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;

        signIn();
        dispatch(login(user));
        navigation.navigate("Home" as never);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error signing in: ", errorCode, errorMessage);
        console.error("Erreur lors de la récupération des utilisateurs", error);
        Alert.alert("Error", errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={handleSignIn}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
           <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color={colors.secondary} />
              <TextInput
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                style={styles.input}
                keyboardType="email-address"
                inputMode="email"
                autoCapitalize="none"
              />
            </View>
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color={colors.secondary} />
              <TextInput
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
                style={styles.input}
              />
            </View>
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <View style={styles.buttonContainer}>
              <AppButton
                title="Sign In"
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 25,
    width: '90%',
    padding: 15,
    marginBottom: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize:14,
    fontWeight:'bold',
  },
});

export default SignIn;
