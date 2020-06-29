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
import { GameEntities, CollidableEntity } from "../types";
import store from "../redux/store";
import { setCurrentLevelIndex, setGameRunning } from "../redux/actions";
const levelIndex = require("../../assets/levels/levelIndex.json");

export const Physics = (
  entities: GameEntities,
  loop: GameEngineUpdateEventOptionType
): GameEntities => {
  let { engine, world } = entities.physics;
  const { time } = loop;
  Matter.Engine.update(engine, time.delta);

  let bodiesToRemove: CollidableEntity[] = [];

  entities.arrows.items.forEach((obj) =>
    postUpdatePhysics(obj, bodiesToRemove, world)
  );
  entities.targets.items.forEach((obj) => {
    postUpdatePhysics(obj, bodiesToRemove, world);
  });
  entities.obstacles.items.forEach((obj) => {
    postUpdatePhysics(obj, bodiesToRemove, world);
  });

  bodiesToRemove.forEach((obj) => {
    factory.destroy(entities, obj);
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
  entities.targets.items.forEach(moveToWaypoint);
  entities.obstacles.items.forEach(moveToWaypoint);
  return entities;
};

export const EvaluateObjectives = (
  entities: GameEntities,
  loop: GameEngineUpdateEventOptionType
): GameEntities => {
  if (entities.targets.items.length <= 0) {
    factory.clear(entities);
    // load next level
    // const levelIndex = store.getState().currentLevelIndex;
    store.dispatch(
      setCurrentLevelIndex(store.getState().currentLevelIndex + 1)
    );
    const state = store.getState();
    const currentLevel = require(`../../assets/levels/${
      levelIndex["levels"][state.currentLevelIndex]
    }`);

    for (let obstacle of currentLevel.obstacles) {
      factory.obstacle(entities, obstacle.position, obstacle.movePath);
    }
    for (let target of currentLevel.targets) {
      factory.target(entities, target.position, target.movePath);
    }
  }
  return entities;
};

function postUpdatePhysics(
  obj: CollidableEntity,
  bodiesToRemove: CollidableEntity[],
  world: Matter.World
) {
  // move static bodies that have velocity
  if (obj.body.isStatic) {
    Matter.Body.setPosition(obj.body, {
      x: obj.body.position.x + obj.body.velocity.x,
      y: obj.body.position.y + obj.body.velocity.y,
    });
  }

  // remove entities with bodies that have been removed from the physics engine
  if (
    !Matter.Bounds.overlaps(world.bounds, obj.body.bounds) ||
    !Matter.Composite.get(world, obj.body.id, obj.body.type)
  ) {
    bodiesToRemove.push(obj);
  }
}

function moveToWaypoint(obj: CollidableEntity) {
  if (!obj.movePath) return;
  const distanceToWaypoint = distance(
    obj.body.position,
    obj.movePath.waypoints[obj.movePath.index]
  );
  if (distanceToWaypoint < obj.movePath.speed) {
    obj.movePath.index =
      (obj.movePath.index + 1) % obj.movePath.waypoints.length;
  }
  const waypoint = obj.movePath.waypoints[obj.movePath.index];
  const angle = Matter.Vector.angle(obj.body.position, waypoint);
  const vector = {
    x: Math.cos(angle) * obj.movePath.speed,
    y: Math.sin(angle) * obj.movePath.speed,
  };
  Matter.Body.setVelocity(obj.body, vector);
}
