export const setCurrentLevelIndex = (level: number) => ({
  type: "SET_CURRENT_LEVEL_INDEX",
  level,
});

export const setGameRunning = (running: boolean) => ({
  type: "SET_GAME_RUNNING",
  running,
});
