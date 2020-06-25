import * as constants from "../constants";

interface point {
  x: number;
  y: number;
}

export function toGameCoordinates(screenCoordinates: point): point {
  return {
    x: (screenCoordinates.x - constants.GAME_OFFSET_X) / constants.GAME_SCALE,
    y: (screenCoordinates.y - constants.GAME_OFFSET_Y) / constants.GAME_SCALE,
  };
}

export function getBowDrawDistance(downPoint: point, dragPoint: point): number {
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

export function getBowRotation(dragPoint: point): number {
  let rotation = Math.atan(
    (dragPoint.y - constants.BOW_ANCHOR_Y) /
      (dragPoint.x - constants.BOW_ANCHOR_X)
  );
  if (rotation < -1 * constants.MAX_BOW_ROTATION_RADIANS) {
    rotation = -1 * constants.MAX_BOW_ROTATION_RADIANS;
  } else if (rotation > constants.MAX_BOW_ROTATION_RADIANS) {
    rotation = constants.MAX_BOW_ROTATION_RADIANS;
  }

  return rotation;
}

export function getArrowForceVector(
  drawDistance: number,
  rotation: number
): point {
  const force =
    Math.abs(drawDistance / constants.MAX_ARROW_PULL_DISTANCE) *
    constants.MAX_ARROW_FORCE;
  const x = Math.cos(rotation) * force;
  const y = Math.sin(rotation) * force;

  return { x, y };
}
