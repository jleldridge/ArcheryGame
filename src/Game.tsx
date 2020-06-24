import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Bow, KnockedArrow, Target } from "./engine/renderers";
import { Physics, KnockArrow } from "./engine/systems";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  KNOCKED_ARROW_ANCHOR_X,
  KNOCKED_ARROW_ANCHOR_Y,
} from "./constants";

export default function Game() {
  console.log("Rendering Game...");
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  world.gravity.y = 0;
  world.bounds.min = { x: 0, y: 0 };
  world.bounds.max = { x: GAME_WIDTH, y: GAME_HEIGHT };

  let target = Matter.Bodies.circle(GAME_WIDTH - 100, GAME_HEIGHT / 2, 50);
  target.label = "target";

  Matter.World.add(world, target);

  let entities = {
    arrowSuffix: 0,
    bowState: { touched: false, dx: 0, dy: 0 },
    physics: { engine, world },
    bow: { renderer: Bow },
    knockedArrow: {
      position: { x: KNOCKED_ARROW_ANCHOR_X, y: KNOCKED_ARROW_ANCHOR_Y },
      renderer: KnockedArrow,
    },
    target: { body: target, renderer: Target },
  };

  return (
    <GameEngine
      style={styles.container}
      systems={[KnockArrow, Physics]}
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
