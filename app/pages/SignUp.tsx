import React from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import AppButton from '../components/AppButton';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from '@firebase/firestore';
import { firebaseConfig } from '../config/config';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome';

interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  password: string;
  address: string;
}

const SignUpSchema = Yup.object().shape({
  nom: Yup.string().required('Required'),
  prenom: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .matches(/[@$!%*#?&]/, 'Password must contain at least one special character.'),
  address: Yup.string().required('Required'),
});

const SignUp = () => {
  const navigation = useNavigation();
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const handleSignUp = (values: User, { setSubmitting }: FormikHelpers<User>) => {
    setSubmitting(false);

    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Success', 'Utilisateur créé avec succès');
        navigation.navigate('SignIn' as never);
        
        addDoc(collection(db, 'Utilisateurs'), {
          id: user.uid,
          email: values.email,
          password: values.password,
          adresse: values.address,
          nom: values.nom,
          prenom: values.prenom,
        })
          .then((docRef) => {
            const docId = docRef.id;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error adding document: ', errorCode, errorMessage);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error signing up: ', errorCode, errorMessage);
      });

   
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ id: '', nom: '', prenom: '', email: '', password: '', address: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#4ecdc4" />
              <TextInput
                placeholder="nom"
                onChangeText={handleChange('nom')}
                onBlur={handleBlur('nom')}
                value={values.nom}
                style={styles.input}
              />
            </View>
            {errors.nom && touched.nom && <Text style={styles.error}>{errors.prenom}</Text>}
           
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#4ecdc4" />
              <TextInput
                placeholder="prenom"
                onChangeText={handleChange('prenom')}
                onBlur={handleBlur('prenom')}
                value={values.prenom}
                style={styles.input}
              />
            </View>
            {errors.prenom && touched.prenom && <Text style={styles.error}>{errors.prenom}</Text>}
             
           
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#4ecdc4" />
              <TextInput
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#4ecdc4" />
              <TextInput
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                style={styles.input}
              />
            </View>
            {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
            <View style={styles.inputContainer}>
              <Icon name="home" size={20} color="#4ecdc4" />
              <TextInput
                placeholder="Address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                style={styles.input}
              />
                      </View>
            {errors.address && touched.address && <Text style={styles.error}>{errors.address}</Text>}
            <View style={styles.buttonContainer}>
              <AppButton title="Sign Up" onPress={handleSubmit} disabled={isSubmitting} />
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
    backgroundColor: '#fff',
    padding: 20,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4ecdc4',
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
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default SignUp;
