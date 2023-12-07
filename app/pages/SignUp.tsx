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
        console.log('User signed up: ', user);
        Alert.alert('Success', 'Utilisateur créé avec succès');
        navigation.navigate('SignIn');
        
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
            console.log('Error adding doc: ', errorCode, errorMessage);
            Alert.alert('Error', errorMessage);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error signing up: ', errorCode, errorMessage);
        Alert.alert('Error', errorMessage);
      });

   
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Sign Up</Text>
      <Formik
        initialValues={{ nom: '', prenom: '', email: '', password: '', address: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <TextInput
              placeholder="Nom"
              value={values.nom}
              onChangeText={handleChange('nom')}
              onBlur={handleBlur('nom')}
              style={styles.input}
            />
            {errors.nom && touched.nom && <Text style={styles.error}>{errors.nom}</Text>}

            <TextInput
              placeholder="Prénom"
              value={values.prenom}
              onChangeText={handleChange('prenom')}
              onBlur={handleBlur('prenom')}
              style={styles.input}
            />
            {errors.prenom && touched.prenom && <Text style={styles.error}>{errors.prenom}</Text>}

            <TextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
              keyboardType="email-address"
              inputMode='email'
              autoCapitalize="none"
            />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              style={styles.input}
            />
            {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

            <TextInput
              placeholder="Address"
              value={values.address}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              style={styles.input}
            />
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
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default SignUp;
