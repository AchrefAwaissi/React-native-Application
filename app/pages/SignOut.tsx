import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { Button, View, StyleSheet, Text, Alert, ActivityIndicator } from "react-native";
import colors from "../config/colors";

const SignOut = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = React.useState(false);

    const signOutFunction = async () => {
        const auth = getAuth();
    
        try {
          signOut(auth);
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

    const handleSignOut = async () => {
        Alert.alert(
            "Confirmation",
            "Vous êtes sûr de vouloir vous déconnecter ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Oui",
                    onPress: async () => {
                        try {
                            setIsLoading(true)
                            await signOutFunction(); 
                            navigation.navigate('Welcome' as never);
                        } catch (error) {
                            console.error("Sign-out error:", error);
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Vous êtes déconnecté</Text>
            {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : (
                <Button
                    color={colors.primary}
                    title="Aller à la page de connexion"
                    onPress={handleSignOut}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white,
      },
      heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
      },
});

export default SignOut;

