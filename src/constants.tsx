import { Dimensions } from "react-native";

// Game size and scaling based on window size
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 576;
const X_SCALE = SCREEN_WIDTH / GAME_WIDTH;
const Y_SCALE = SCREEN_HEIGHT / GAME_HEIGHT;
export const GAME_SCALE = Math.min(X_SCALE, Y_SCALE);

export const GAME_OFFSET_X = (SCREEN_WIDTH - GAME_WIDTH * GAME_SCALE) / 2;
export const GAME_OFFSET_Y = (SCREEN_HEIGHT - GAME_HEIGHT * GAME_SCALE) / 2;

// Knocked arrow constraints
export const BOW_ANCHOR_X = 200;
export const BOW_ANCHOR_Y = GAME_HEIGHT / 2;
export const MIN_KNOCKED_ARROW_X = 50;
export const MAX_ARROW_PULL_DISTANCE = 150;
export const MAX_ARROW_FORCE = 1;
export const MAX_BOW_ROTATE_DISTANCE = 100;
export const MAX_BOW_ROTATION_RADIANS = Math.PI / 2;
