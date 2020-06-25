import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Matter from "matter-js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BOW_ANCHOR_X,
  BOW_ANCHOR_Y,
} from "../constants";

type ArrowProps = {
  body: Matter.Body;
  visible: boolean;
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

  return props.visible ? (
    <Image
      source={require("../../assets/Arrow.png")}
      style={[
        styles.arrow,
        { left: x, top: y, transform: [{ rotateZ: `${props.body.angle}rad` }] },
      ]}
    />
  ) : (
    <></>
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
