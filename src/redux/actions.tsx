import { Scene } from "../types";

export const setCurrentScene = (scene: Scene) => ({
  type: "SET_CURRENT_SCENE",
  scene,
});
