import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const index = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>index</Text>
      <Button
        title="Display Notification"
        onPress={() => router.push("/(tabs)")}
      />
    </View>
  );
};

export default index;
