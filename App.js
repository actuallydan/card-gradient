import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import ExpoMaps from "./experiments/ExpoMaps";
import CardTilt from "./experiments/CardTilt";

export default function App() {

  return (
      <View style={styles.cont}>
        {/* <ExpoMaps /> */}
        <CardTilt />
      </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
