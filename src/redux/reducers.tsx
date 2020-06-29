import { RootState } from "../types";
const levelIndex = require("../../assets/levels/levelIndex.json");

const EMPTY_STATE = {
  gameRunning: true,
  currentLevelIndex: -1,
};

export default function reduce(state: RootState = EMPTY_STATE, action: any) {
  switch (action.type) {
    case "SET_GAME_RUNNING":
      return { ...state, gameRunning: action.running };
    case "SET_CURRENT_LEVEL_INDEX":
      console.log("setting current level to", action.level);
      return {
        ...state,
        currentLevelIndex: action.level % levelIndex.levels.length,
      };
    default:
      return state;
  }
}
