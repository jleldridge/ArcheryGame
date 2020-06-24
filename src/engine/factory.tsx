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
  arrow.label = `arrow${entities.arrowSuffix++}`;
  arrow.frictionAir = 0;
  Matter.World.add(physics.world, arrow);

  entities[arrow.label] = {
    body: arrow,
    visible: true,
    renderer: Arrow,
  };

  return arrow;
}

export function target() {}
