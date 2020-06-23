import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Bow, Arrow, Target } from "./engine/renderers";
import { Physics } from "./engine/systems";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants";

export default function Game() {
  console.log("Rendering Game...");
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  world.gravity.y = 0;

  let target = Matter.Bodies.circle(GAME_WIDTH - 100, GAME_HEIGHT / 2, 50);
  Matter.World.add(world, target);

  let entities = {
    physics: { engine, world },
    bow: { renderer: Bow },
    arrow: { renderer: Arrow },
    target: { body: target, renderer: Target },
  };

  return (
    <GameEngine
      style={styles.container}
      systems={[Physics]}
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
