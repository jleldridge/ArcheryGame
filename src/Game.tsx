import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Bow, KnockedArrow, Target } from "./engine/renderers";
import { Physics, KnockArrow } from "./engine/systems";
import { GAME_WIDTH, GAME_HEIGHT, KNOCKED_ARROW_ANCHOR } from "./constants";

export default function Game() {
  console.log("Rendering Game...");
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  world.gravity.y = 0;

  let target = Matter.Bodies.circle(GAME_WIDTH - 100, GAME_HEIGHT / 2, 50);
  let arrow = Matter.Bodies.rectangle(
    KNOCKED_ARROW_ANCHOR.X,
    KNOCKED_ARROW_ANCHOR.Y,
    200,
    40
  );

  Matter.World.add(world, target);
  Matter.World.add(world, arrow);

  let entities = {
    bowState: { touched: false },
    physics: { engine, world },
    bow: { renderer: Bow },
    knockedArrow: {
      body: arrow,
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
