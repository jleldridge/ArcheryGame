import React from "react";
import { StyleSheet, StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Bow, DebugInfo } from "./engine/renderers";
import * as factory from "./engine/factory";
import { Physics, KnockArrow, FollowPaths } from "./engine/systems";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BOW_ANCHOR_X,
  BOW_ANCHOR_Y,
} from "./constants";
import { attachMatterEvents } from "./engine/events";
import { GameEntities } from "./types";

const DEBUG = false;

export default function Game() {
  console.log("Rendering Game...");
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  attachMatterEvents(engine);

  world.gravity.y = 0;
  world.bounds.min = { x: 0, y: 0 };
  world.bounds.max = { x: GAME_WIDTH, y: GAME_HEIGHT };

  let entities: GameEntities = {
    entitySuffix: 0,
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
    debug: { showDebug: DEBUG, renderer: DebugInfo },
  };

  factory.target(
    entities,
    { x: GAME_WIDTH - 100, y: 5 },
    {
      index: 0,
      speed: 4,
      waypoints: [
        { x: GAME_WIDTH - 100, y: 5 },
        { x: GAME_WIDTH - 100, y: GAME_HEIGHT - 5 },
      ],
    }
  );

  factory.obstacle(
    entities,
    { x: GAME_WIDTH - 200, y: GAME_HEIGHT / 2 },
    {
      index: 0,
      speed: 1,
      waypoints: [
        { x: GAME_WIDTH - 200, y: GAME_HEIGHT / 2 },
        { x: GAME_WIDTH - 200, y: 5 },
      ],
    }
  );

  return (
    <GameEngine
      style={styles.container}
      systems={[KnockArrow, FollowPaths, Physics]}
      entities={entities}
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
