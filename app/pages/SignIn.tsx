import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from './AuthContext';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../components/AppButton'; // Assurez-vous d'importer AppButton
 
const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});
const SignIn = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation();
 
  const handleSignIn = (values, { setSubmitting }) => {
    console.log('Credentials:', values);
    signIn();
    setSubmitting(false);
    // navigation.navigate('Profile');
    navigation.navigate('PostScreen');
  };
 
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignInSchema}
        onSubmit={handleSignIn}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <TextInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              style={styles.input}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            <View style={styles.buttonContainer}>
              <AppButton title="Sign In" onPress={handleSubmit} disabled={isSubmitting} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    width: '90%', // Modifié pour occuper 90% de la largeur
    alignSelf: 'center', // Centrer le TextInput
  },
  error: {
    color: 'red',
  },
  // Les styles pour goBackButton et buttonText peuvent être supprimés s'ils ne sont pas utilisés
});
 
export default SignIn;
 