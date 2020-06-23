import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 576;
const X_SCALE = SCREEN_WIDTH / GAME_WIDTH;
const Y_SCALE = SCREEN_HEIGHT / GAME_HEIGHT;

export const GAME_SCALE = Math.min(X_SCALE, Y_SCALE);

export const KNOCKED_ARROW_ANCHOR = {
  X: 200,
  Y: GAME_HEIGHT / 2,
};
