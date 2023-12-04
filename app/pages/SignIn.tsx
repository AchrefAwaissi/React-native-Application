import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from './AuthContext'; // Assurez-vous d'importer depuis le bon chemin
import { useNavigation } from '@react-navigation/native'; // Importer useNavigation



const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignIn = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation(); // Utiliser useNavigation

  const handleSignIn = (values, { setSubmitting }) => {
    // Implémentez votre logique de vérification d'identifiants ici
    console.log('Credentials:', values);
    signIn(); // Appel de la fonction de connexion du contexte
    setSubmitting(false);
    navigation.navigate('Profile'); 
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
            <Button onPress={handleSubmit} title="Sign In" disabled={isSubmitting} />
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
 input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    fontSize: 16,
 },
 error: {
    color: 'red',
 },
 goBackButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
 },
 buttonText: {
    color: 'white',
    fontWeight: 'bold',
 },
});


export default SignIn;






// SignIn.js
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { useAuth } from './AuthContext'; // Import depuis le bon chemin
// import { useNavigation } from '@react-navigation/native'; // Import de useNavigation

// const SignInSchema = Yup.object().shape({
//   email: Yup.string().email('Invalid email').required('Required'),
//   password: Yup.string().required('Required'),
// });

// const SignIn = () => {
//   const { signIn, isLoggedIn } = useAuth(); // Ajout de isLoggedIn
//   const navigation = useNavigation();

//   const handleSignIn = async (values, { setSubmitting }) => {
//     console.log('Credentials:', values);
//     await signIn(); // Si signIn est une fonction asynchrone
//     setSubmitting(false);

//     // La navigation est gérée dans useEffect
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       navigation.navigate('Profile');
//     }
//   }, [isLoggedIn, navigation]);

//   return (
//       <View style={styles.container}>
//         <Formik
//           initialValues={{ email: '', password: '' }}
//           validationSchema={SignInSchema}
//           onSubmit={handleSignIn}
//         >
//           {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
//             <>
//               <TextInput
//                 placeholder="Email"
//                 onChangeText={handleChange('email')}
//                 onBlur={handleBlur('email')}
//                 value={values.email}
//                 style={styles.input}
//               />
//               {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
//               <TextInput
//                 placeholder="Password"
//                 onChangeText={handleChange('password')}
//                 onBlur={handleBlur('password')}
//                 value={values.password}
//                 secureTextEntry
//                 style={styles.input}
//               />
//               {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
//               <Button onPress={handleSubmit} title="Sign In" disabled={isSubmitting} />
//             </>
//           )}
//         </Formik>
//       </View>
//     );
//   };
//   const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#F5FCFF',
//    },
//    input: {
//       height: 40,
//       borderColor: 'gray',
//       borderWidth: 1,
//       borderRadius: 5,
//       paddingLeft: 10,
//       paddingRight: 10,
//       marginBottom: 10,
//       fontSize: 16,
//    },
//    error: {
//       color: 'red',
//    },
//    goBackButton: {
//       backgroundColor: 'blue',
//       padding: 10,
//       borderRadius: 5,
//       marginTop: 10,
//    },
//    buttonText: {
//       color: 'white',
//       fontWeight: 'bold',
//    },
//   });

// export default SignIn;
