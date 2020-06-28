import Matter from "matter-js";
import { Arrow, Target, Obstacle } from "./renderers";
import { CollidableObject, MovePath, GameEntities, Point } from "../types";

export function arrow(entities: GameEntities): CollidableObject {
  const { bow, physics } = entities;

  let arrowBody = Matter.Bodies.rectangle(
    bow.position.x,
    bow.position.y,
    200,
    40
  );
  arrowBody.label = `arrow${entities.entitySuffix++}`;
  arrowBody.frictionAir = 0;
  Matter.World.add(physics.world, arrowBody);

  entities[arrowBody.label] = {
    body: arrowBody,
    renderer: Arrow,
  };

  return entities[arrowBody.label];
}

export function target(
  entities: GameEntities,
  position: Point,
  movePath?: MovePath
): CollidableObject {
  const { physics } = entities;

  let targetBody = Matter.Bodies.circle(position.x, position.y, 50);
  targetBody.label = `target${entities.entitySuffix++}`;
  targetBody.frictionAir = 0;
  Matter.World.add(physics.world, targetBody);

  entities[targetBody.label] = {
    body: targetBody,
    movePath: movePath,
    renderer: Target,
  };

  return entities[targetBody.label];
}

export function obstacle(
  entities: GameEntities,
  position: Point,
  movePath?: MovePath
): CollidableObject {
  const { physics } = entities;

  let obstacleBody = Matter.Bodies.rectangle(position.x, position.y, 10, 70);
  obstacleBody.label = `obstacle${entities.entitySuffix++}`;
  obstacleBody.frictionAir = 0;
  Matter.Body.setStatic(obstacleBody, true);
  Matter.World.add(physics.world, obstacleBody);

  entities[obstacleBody.label] = {
    body: obstacleBody,
    movePath,
    renderer: Obstacle,
  };

  return entities[obstacleBody.label];
}

export function destroy(entities: any, body: Matter.Body) {
  const world = entities.physics.world;
  Matter.World.remove(world, body);
  delete entities[body.label];
}
