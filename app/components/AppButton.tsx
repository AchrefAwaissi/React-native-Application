import React from "react"; 
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

type ValidColor = keyof typeof colors;

interface AppButtonProps {
  title: string;
  onPress: () => void;
  color?: ValidColor;
}

function AppButton({ title, onPress, color = "primary" }: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
