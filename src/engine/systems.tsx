import Matter from "matter-js";
import * as factory from "./factory";
import { GameEngineUpdateEventOptionType } from "react-native-game-engine";
import {
  toGameCoordinates,
  getBowRotation,
  getBowDrawDistance,
  getArrowForceVector,
  distance,
} from "./util";
import { GameEntities } from "../types";

export const Physics = (
  entities: GameEntities,
  loop: GameEngineUpdateEventOptionType
): GameEntities => {
  let { engine, world } = entities.physics;
  const { time } = loop;
  Matter.Engine.update(engine, time.delta);

  let bodiesToRemove: Matter.Body[] = [];
  // remove entities with bodies that have been removed from the physics engine
  Object.values<any>(entities)
    .filter((v) => v.body)
    .forEach((v) => {
      if (
        !Matter.Bounds.overlaps(world.bounds, v.body.bounds) ||
        !Matter.Composite.get(world, v.body.id, v.body.type)
      ) {
        bodiesToRemove.push(v.body);
      }
    });

  bodiesToRemove.forEach((body) => {
    factory.destroy(entities, body);
  });

  return entities;
};

export const KnockArrow = (
  entities: GameEntities,
  loop: GameEngineUpdateEventOptionType
): GameEntities => {
  const { touches } = loop;
  let bow = entities["bow"];

  if (bow.touched) {
    const release = touches.find((t: any) => t.type === "end");
    if (release) {
      bow.arrowVisible = false;

      if (bow.drawDistance < 0) {
        let arrow = factory.arrow(entities);
        Matter.Body.rotate(arrow.body, bow.rotation);

        Matter.Body.applyForce(
          arrow.body,
          arrow.body.position,
          getArrowForceVector(bow.drawDistance, bow.rotation)
        );
      }
      bow.rotation = 0;
      bow.touched = false;
      bow.downPoint = null;
      bow.drawDistance = 0;
    } else {
      const dragTouch = touches.find((t: any) => t.type === "move");
      if (dragTouch && bow.downPoint) {
        const dragPoint = toGameCoordinates({
          x: dragTouch.event.pageX,
          y: dragTouch.event.pageY,
        });

        bow.rotation = getBowRotation(bow.downPoint, dragPoint);
        bow.drawDistance = getBowDrawDistance(bow.downPoint, dragPoint);

        entities.debug.dragPoint = dragPoint;
      }
    }
  } else {
    const touch = touches.find((t: any) => t.type === "start");
    if (touch) {
      bow.touched = true;
      bow.downPoint = toGameCoordinates({
        x: touch.event.pageX,
        y: touch.event.pageY,
      });
      bow.rotation = 0;
      bow.arrowVisible = true;
      entities.debug.touchDown = bow.downPoint;
    }
  }

  return entities;
};

export const FollowPaths = (
  entities: GameEntities,
  loop: GameEngineUpdateEventOptionType
): GameEntities => {
  Object.values(entities)
    .filter((v) => v.movePath && v.body)
    .forEach((v) => {
      const distanceToWaypoint = distance(
        v.body.position,
        v.movePath.waypoints[v.movePath.index]
      );
      if (distanceToWaypoint < v.movePath.speed) {
        v.movePath.index = (v.movePath.index + 1) % v.movePath.waypoints.length;
        const waypoint = v.movePath.waypoints[v.movePath.index];
        const angle = Matter.Vector.angle(v.body.position, waypoint);
        const vector = {
          x: Math.cos(angle) * v.movePath.speed,
          y: Math.sin(angle) * v.movePath.speed,
        };
        Matter.Body.setVelocity(v.body, vector);
      }
    });

  return entities;
};
