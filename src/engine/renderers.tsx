import React from "react";
import { StyleSheet, Image } from "react-native";
import Matter from "matter-js";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants";

type TargetProps = {
  body: Matter.Body;
};

export function Arrow() {
  return (
    <Image
      source={require("../../assets/Arrow.png")}
      style={[styles.arrow, { left: 100, top: GAME_HEIGHT / 2 - 20 }]}
    />
  );
}

export function Bow() {
  return (
    <Image
      source={require("../../assets/Bow.png")}
      style={[styles.bow, { left: 100, top: GAME_HEIGHT / 2 - 100 }]}
    />
  );
}

export function Target(props: TargetProps) {
  // x and y are at the center of the image
  let x = props.body.position.x - 50;
  let y = props.body.position.y - 50;

  return (
    <Image
      source={require("../../assets/Target.png")}
      style={[styles.target, { left: x, top: y }]}
    />
  );
}

const styles = StyleSheet.create({
  arrow: {
    width: 200,
    height: 40,
    position: "absolute",
  },

  bow: {
    width: 105,
    height: 200,
    position: "absolute",
  },

  target: {
    width: 100,
    height: 100,
    position: "absolute",
  },
});
