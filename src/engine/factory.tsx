import Matter from "matter-js";
import { Arrow } from "./renderers";

export function arrow(entities: any): Matter.Body {
  const { knockedArrow, physics } = entities;

  let arrow = Matter.Bodies.rectangle(
    knockedArrow.position.x,
    knockedArrow.position.y,
    200,
    40
  );
  arrow.label = `arrow${entities.entitySuffix++}`;
  arrow.frictionAir = 0;
  Matter.World.add(physics.world, arrow);

  entities[arrow.label] = {
    body: arrow,
    visible: true,
    renderer: Arrow,
  };

  return arrow;
}

export function destroy(entities: any, body: Matter.Body) {
  const world = entities.physics.world;
  Matter.World.remove(world, body);
  delete entities[body.label];
}

export function target() {}
