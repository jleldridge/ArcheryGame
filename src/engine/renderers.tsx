import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Matter from "matter-js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BOW_ANCHOR_X,
  BOW_ANCHOR_Y,
} from "../constants";
import { Point } from "../types";

type ArrowProps = {
  body: Matter.Body;
};

type BowProps = {
  position: { x: number; y: number };
  rotation: number;
  drawDistance: number;
  arrowVisible: boolean;
};

type TargetProps = {
  body: Matter.Body;
};

type ObstacleProps = {
  body: Matter.Body;
};

type DebugProps = {
  showDebug: boolean;
  touchDown: { x: number; y: number };
  dragPoint: { x: number; y: number };
  currentTouchPoint: { x: number; y: number };
  angle: number;
};

export function Arrow(props: ArrowProps) {
  let x = props.body.position.x - 100;
  let y = props.body.position.y - 20;

  return (
    <Image
      source={require("../../assets/Arrow.png")}
      style={[
        styles.arrow,
        { left: x, top: y, transform: [{ rotateZ: `${props.body.angle}rad` }] },
      ]}
    />
  );
}

export function Bow(props: BowProps) {
  return (
    <View
      style={[
        {
          position: "absolute",
          left: props.position.x,
          top: props.position.y,
          transform: [
            { rotateZ: `${props.rotation}rad` },
            { perspective: 500 },
          ],
        },
      ]}
    >
      <Image
        source={require("../../assets/Bow.png")}
        style={[styles.bow, { top: -100, left: -52.5 }]}
      />
      {props.arrowVisible ? (
        <Image
          source={require("../../assets/Arrow.png")}
          style={[
            styles.arrow,
            {
              left: props.drawDistance - 100,
              top: -20,
            },
          ]}
        />
      ) : (
        <></>
      )}
    </View>
  );
}

export function Target(props: TargetProps) {
  let position = getAdjustedPosition(props.body.position, 100, 100);

  return (
    <Image
      source={require("../../assets/Target.png")}
      style={[styles.target, { left: position.x, top: position.y }]}
    />
  );
}

export function Obstacle(props: ObstacleProps) {
  const width = 10;
  const height = 70;
  const position = getAdjustedPosition(props.body.position, width, height);

  return (
    <View
      style={{
        position: "absolute",
        width,
        height,
        left: position.x,
        top: position.y,
        backgroundColor: "red",
        transform: [
          { rotateZ: `${props.body.angle}rad` },
          { perspective: 500 },
        ],
      }}
    />
  );
}

export function DebugInfo(props: DebugProps) {
  if (!props.showDebug) return <></>;

  return (
    <View
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "transparent",
      }}
    >
      <View
        style={[
          styles.debugCircle,
          {
            position: "absolute",
            left: BOW_ANCHOR_X - 5,
            top: BOW_ANCHOR_Y - 5,
          },
        ]}
      />
      {props.touchDown ? (
        <View
          style={[
            styles.debugCircle,
            {
              position: "absolute",
              left: props.touchDown.x - 5,
              top: props.touchDown.y - 5,
            },
          ]}
        />
      ) : (
        <></>
      )}
      {props.dragPoint ? (
        <View
          style={[
            styles.debugCircle,
            {
              position: "absolute",
              left: props.dragPoint.x - 5,
              top: props.dragPoint.y - 5,
            },
          ]}
        />
      ) : (
        <></>
      )}
    </View>
  );
}

function getAdjustedPosition(
  position: Point,
  width: number,
  height: number
): Point {
  return { x: position.x - width / 2, y: position.y - height / 2 };
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

  debugCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
});
