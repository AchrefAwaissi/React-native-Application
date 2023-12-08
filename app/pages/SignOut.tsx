import { useNavigation } from "@react-navigation/native";
import { Button, View, StyleSheet, Text } from "react-native";


const SignOut = () => {
    const navigation = useNavigation();
    const handleSignOut = async () => {
        navigation.navigate('Welcome')
    };

    return (

    <View style={styles.buttonContainer}>
        <Text>Vous êtes déconnecté</Text>
                    <Button
                    title="Aller à la page de connexion"
                    onPress={handleSignOut}
                    />
    </View>

)};


const styles = StyleSheet.create({
    buttonContainer: {

        height:100,
        width: "100%",
        backgroundColor:"#f0f0f0",
        justifyContent:"flex-end",
        alignItems:"flex-end"
      }
});

export default SignOut;