import Matter from "matter-js";
import { CollidableEntity, MovePath, GameEntities, Point } from "../types";

export function arrow(entities: GameEntities): CollidableEntity {
  const { bow, physics } = entities;

  let arrowBody = Matter.Bodies.rectangle(
    bow.position.x,
    bow.position.y,
    200,
    40
  );
  arrowBody.label = `arrows`;
  arrowBody.frictionAir = 0;
  Matter.World.add(physics.world, arrowBody);

  const arrow = {
    body: arrowBody,
  };
  entities.arrows.items.push(arrow);

  return arrow;
}

export function target(
  entities: GameEntities,
  position: Point,
  movePath?: MovePath
): CollidableEntity {
  const { physics } = entities;

  let targetBody = Matter.Bodies.circle(position.x, position.y, 50);
  targetBody.label = `targets`;
  targetBody.frictionAir = 0;
  Matter.World.add(physics.world, targetBody);

  const target = {
    body: targetBody,
    movePath: movePath,
  };
  entities.targets.items.push(target);

  return target;
}

export function obstacle(
  entities: GameEntities,
  position: Point,
  movePath?: MovePath
): CollidableEntity {
  const { physics } = entities;

  let obstacleBody = Matter.Bodies.rectangle(position.x, position.y, 10, 70);
  obstacleBody.label = `obstacles`;
  obstacleBody.frictionAir = 0;
  Matter.Body.setStatic(obstacleBody, true);
  Matter.World.add(physics.world, obstacleBody);

  const obstacle = {
    body: obstacleBody,
    movePath,
  };
  entities.obstacles.items.push(obstacle);

  return obstacle;
}

export function destroy(entities: any, obj: CollidableEntity) {
  const world = entities.physics.world;
  Matter.World.remove(world, obj.body);
  // this really needs to be made more efficient
  entities[obj.body.label].items.splice(
    entities[obj.body.label].items.indexOf(obj),
    1
  );
}

export function clear(entities: GameEntities) {
  for (let obj of entities.arrows.items) {
    destroy(entities, obj);
  }
  for (let obj of entities.targets.items) {
    destroy(entities, obj);
  }
  for (let obj of entities.obstacles.items) {
    destroy(entities, obj);
  }
}
