import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface User {
  name: string;
  email: string;
  password: string;
  address: string;
}

const SignInSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().min(4, 'Password is too short - should be 4 chars minimum').required('Required'),
  address: Yup.string().required('Required'),
});

const SignUp = () => {
  const navigation = useNavigation();

  const users: User[] = [
    { name: 'Achref', email: 'Achref@gmail.com', password: '1234', address: '123 Street' },
    // Add more users as needed
  ];

  const handleGoBack = () => {
    navigation.navigate('Welcome');
  };

  const handleSignUp = (values: User, { setSubmitting }: FormikHelpers<User>) => {
    const user = users.find(u => u.email === values.email && u.password === values.password);

    if (user) {
      console.log('Sign Up successful. User:', user);
      navigation.navigate('SignIn');
    } else {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign Up</Text>
      <Formik
        initialValues={{ name: '', email: '', password: '', address: '' }}
        validationSchema={SignInSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }: FormikProps<User>) => (
          <>
            <TextInput
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              style={styles.input}
            />
            {errors.name && touched.name && <Text style={styles.error}>{errors.name}</Text>}
            <TextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
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
            <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            <Button title="Sign Up" onPress={handleSubmit} disabled={isSubmitting} />
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

export default SignUp;
