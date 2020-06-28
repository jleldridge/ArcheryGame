import * as constants from "../constants";
import { Point, ScreenOrientation } from "../types";
import { Dimensions } from "react-native";

export function toGameCoordinates(screenCoordinates: Point): Point {
  const gameScale = getGameScale();
  const orientation = getScreenOrientation();
  const screenx =
    orientation === "landscape"
      ? screenCoordinates.x
      : -1 * screenCoordinates.y;
  const screeny =
    orientation === "landscape" ? screenCoordinates.y : screenCoordinates.x;
  return {
    x: (screenx - getGameOffsetX()) / gameScale,
    y: (screeny - getGameOffsetY()) / gameScale,
  };
}

export function getBowDrawDistance(downPoint: Point, dragPoint: Point): number {
  if (dragPoint.x - downPoint.x > 0) {
    return 0;
  }
  let drawDistance = -1 * distance(dragPoint, downPoint);
  drawDistance = Math.max(drawDistance, -1 * constants.MAX_ARROW_PULL_DISTANCE);

  return drawDistance;
}

export function getBowRotation(downPoint: Point, dragPoint: Point): number {
  let rotation = Math.atan(
    (dragPoint.y - downPoint.y) / (dragPoint.x - downPoint.x)
  );
  const dx = dragPoint.x - downPoint.x;
  const dy = dragPoint.y - downPoint.y;
  if (dx > 0) {
    rotation =
      dy < 0
        ? constants.MAX_BOW_ROTATION_RADIANS
        : -1 * constants.MAX_BOW_ROTATION_RADIANS;
  }

  return rotation;
}

export function getArrowForceVector(
  drawDistance: number,
  rotation: number
): Point {
  const force =
    Math.abs(drawDistance / constants.MAX_ARROW_PULL_DISTANCE) *
    constants.MAX_ARROW_FORCE;
  const x = Math.cos(rotation) * force;
  const y = Math.sin(rotation) * force;

  return { x, y };
}

export function getScreenHeight(): number {
  return Dimensions.get("window").height;
}

export function getScreenWidth(): number {
  return Dimensions.get("window").width;
}

export function getGameScale(): number {
  if (getScreenOrientation() === "landscape") {
    const xScale = getScreenWidth() / constants.GAME_WIDTH;
    const yScale = getScreenHeight() / constants.GAME_HEIGHT;
    return Math.min(xScale, yScale);
  } else {
    const xScale = getScreenHeight() / constants.GAME_WIDTH;
    const yScale = getScreenWidth() / constants.GAME_HEIGHT;
    return Math.min(xScale, yScale);
  }
}

export function getGameOffsetX(): number {
  if (getScreenOrientation() === "landscape") {
    return (getScreenWidth() - constants.GAME_WIDTH * getGameScale()) / 2;
  } else {
    return (getScreenHeight() - constants.GAME_WIDTH * getGameScale()) / 2;
  }
}

export function getGameOffsetY(): number {
  if (getScreenOrientation() === "landscape") {
    return (getScreenHeight() - constants.GAME_HEIGHT * getGameScale()) / 2;
  } else {
    return (getScreenWidth() - constants.GAME_HEIGHT * getGameScale()) / 2;
  }
}

export function getScreenOrientation(): ScreenOrientation {
  return getScreenHeight() > getScreenWidth() ? "portrait" : "landscape";
}

export function distance(point1: Point, point2: Point): number {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}
