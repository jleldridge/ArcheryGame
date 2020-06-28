import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { useDimensions } from "@react-native-community/hooks";
import store from "./src/redux/store";
import { GAME_WIDTH, GAME_HEIGHT } from "./src/constants";
import Game from "./src/Game";
import { getGameScale, getScreenOrientation } from "./src/engine/util";

export default function App() {
  const screenOrientation = getScreenOrientation();
  const window = useDimensions().window;

  return (
    <Provider store={store}>
      <View
        style={[
          styles.container,
          { width: window.width, height: window.height },
        ]}
      >
        <View
          style={[
            styles.sceneContainer,
            {
              transform: [
                {
                  rotateZ: screenOrientation === "portrait" ? "-90deg" : "0deg",
                },
                { scale: getGameScale() },
              ],
            },
          ]}
        >
          <Game />
        </View>
      </View>
    </Provider>
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
