import { Dimensions } from "react-native";

// Game size and scaling based on window size
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 576;
const X_SCALE = SCREEN_WIDTH / GAME_WIDTH;
const Y_SCALE = SCREEN_HEIGHT / GAME_HEIGHT;
export const GAME_SCALE = Math.min(X_SCALE, Y_SCALE);

// Knocked arrow constraints
export const KNOCKED_ARROW_ANCHOR_X = 200;
export const KNOCKED_ARROW_ANCHOR_Y = GAME_HEIGHT / 2;
export const MIN_KNOCKED_ARROW_X = 50;
export const MAX_ARROW_PULL_DISTANCE = Math.abs(
  KNOCKED_ARROW_ANCHOR_X - MIN_KNOCKED_ARROW_X
);
export const MAX_ARROW_FORCE = 1;
