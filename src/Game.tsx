import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Bow, DebugInfo, Arrows, Targets, Obstacles } from "./engine/renderers";
import * as factory from "./engine/factory";
import {
  Physics,
  KnockArrow,
  FollowPaths,
  EvaluateObjectives,
} from "./engine/systems";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BOW_ANCHOR_X,
  BOW_ANCHOR_Y,
} from "./constants";
import { attachMatterEvents } from "./engine/events";
import { GameEntities, RootState } from "./types";

const DEBUG = false;

export default function Game() {
  console.log("Rendering Game...");

  const running = useSelector((state: RootState) => state.gameRunning);

  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  attachMatterEvents(engine);

  world.gravity.y = 0;
  world.bounds.min = { x: 0, y: 0 };
  world.bounds.max = { x: GAME_WIDTH, y: GAME_HEIGHT };

  let entities: GameEntities = {
    physics: { engine, world },
    bow: {
      touched: false,
      downPoint: null,
      rotation: 0,
      drawDistance: 0,
      arrowVisible: false,
      position: { x: BOW_ANCHOR_X, y: BOW_ANCHOR_Y },
      renderer: Bow,
    },
    arrows: { renderer: Arrows, items: [] },
    targets: { renderer: Targets, items: [] },
    obstacles: { renderer: Obstacles, items: [] },
    debug: { showDebug: DEBUG, renderer: DebugInfo },
  };

  return (
    <GameEngine
      style={styles.container}
      systems={[KnockArrow, FollowPaths, Physics, EvaluateObjectives]}
      entities={entities}
      running={running}
    >
      <StatusBar hidden={true} />
    </GameEngine>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7ED7DF",
  },
});
