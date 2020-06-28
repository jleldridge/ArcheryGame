import { RootState } from "../types";

const EMPTY_STATE = {
  currentScene: {},
};

export default function reduce(state: RootState = EMPTY_STATE, action: any) {
  switch (action.type) {
    case "SET_CURRENT_SCENE":
      return { ...state, currentScene: action.scene };
    default:
      return state;
  }
}
