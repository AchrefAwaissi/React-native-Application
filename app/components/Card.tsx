import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";

interface CardProps {
  title: string;
  subTitle: string;
  price: number;
  description: string;
  image: ImageSourcePropType;
}

function Card({ title, subTitle, image, price, description }: CardProps) {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={image} />
      <View style={styles.detailsContainer}>
        <AppText style={styles.title}>{title}</AppText>
        <AppText style={styles.price}>{price}</AppText>
        <AppText style={styles.description}>{description}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  title: {
    marginBottom: 7,
  },
  price: {},
  description: {
  },
});

export default Card;

