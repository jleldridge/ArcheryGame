import * as constants from "../constants";
import { Point } from "../types";

export function toGameCoordinates(screenCoordinates: Point): Point {
  return {
    x: (screenCoordinates.x - constants.GAME_OFFSET_X) / constants.GAME_SCALE,
    y: (screenCoordinates.y - constants.GAME_OFFSET_Y) / constants.GAME_SCALE,
  };
}

export function getBowDrawDistance(downPoint: Point, dragPoint: Point): number {
  if (dragPoint.x - downPoint.x > 0) {
    return 0;
  }
  let drawDistance =
    -1 *
    Math.sqrt(
      Math.pow(dragPoint.x - downPoint.x, 2) +
        Math.pow(dragPoint.y - downPoint.y, 2)
    );
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
