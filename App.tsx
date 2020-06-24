import React from "react";
import { StyleSheet, View } from "react-native";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_SCALE,
} from "./src/constants";
import Game from "./src/Game";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.sceneContainer}>
        <Game />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "black",
  },

  sceneContainer: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    transform: [{ scale: GAME_SCALE }],
    backgroundColor: "#7ED7DF",
    overflow: "hidden",
  },
});
