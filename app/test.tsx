import React from "react";
import { StyleSheet, Text, View } from "react-native";

const test = () => {
  return (
    <View style={styles.container}>
      <Text>test</Text>
    </View>
  );
};

export default test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
