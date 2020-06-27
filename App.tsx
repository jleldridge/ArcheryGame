import React from "react";
import { StyleSheet, View } from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import { GAME_WIDTH, GAME_HEIGHT } from "./src/constants";
import Game from "./src/Game";
import {
  getScreenWidth,
  getScreenHeight,
  getGameScale,
  getScreenOrientation,
} from "./src/engine/util";

export default function App() {
  const screenOrientation = getScreenOrientation();
  const screen = useDimensions().screen;

  return (
    <View
      style={[styles.container, { width: screen.width, height: screen.height }]}
    >
      <View
        style={[
          styles.sceneContainer,
          {
            transform: [
              { rotateZ: screenOrientation === "portrait" ? "-90deg" : "0deg" },
              { scale: getGameScale() },
            ],
          },
        ]}
      >
        <Game />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },

  sceneContainer: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#7ED7DF",
    overflow: "hidden",
  },
});
