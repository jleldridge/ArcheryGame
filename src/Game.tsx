import React from "react";
import { StyleSheet, StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Bow, Target, DebugInfo } from "./engine/renderers";
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

  let target = Matter.Bodies.circle(GAME_WIDTH - 100, 5, 50);
  target.frictionAir = 0;
  target.label = "target";

  Matter.World.add(world, target);

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
    target: {
      body: target,
      movePath: {
        index: 0,
        speed: 4,
        waypoints: [
          { ...target.position },
          { x: target.position.x, y: GAME_HEIGHT - 5 },
        ],
      },
      renderer: Target,
    },
    debug: { showDebug: DEBUG, renderer: DebugInfo },
  };

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
