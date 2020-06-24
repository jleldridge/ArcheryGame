import Matter from "matter-js";
import * as constants from "../constants";
import { Arrow } from "./renderers";

const Physics = (
  entities: any,
  { touches, time }: { touches: any; time: any }
) => {
  let {
    engine,
    world,
  }: { engine: Matter.Engine; world: Matter.World } = entities.physics;

  Matter.Engine.update(engine, time.delta);
  // world.bodies.forEach((body) => {});

  return entities;
};

const KnockArrow = (entities: any, { touches }: { touches: any }) => {
  let bowState = entities["bowState"];
  let knockedArrow = entities["knockedArrow"];

  if (bowState.touched) {
    const release = touches.find((t: any) => t.type === "end");
    if (release) {
      const world = entities.physics.world;
      knockedArrow.visible = false;
      knockedArrow.position.x = constants.KNOCKED_ARROW_ANCHOR.X;
      knockedArrow.position.y = constants.KNOCKED_ARROW_ANCHOR.Y;

      if (bowState.dx < 0) {
        let arrow = Matter.Bodies.rectangle(
          knockedArrow.position.x,
          knockedArrow.position.y,
          200,
          40
        );
        Matter.World.add(world, arrow);

        entities["arrow"] = { body: arrow, visible: true, renderer: Arrow };
        const forceX = Math.min(0.01 * Math.abs(bowState.dx), 1);
        Matter.Body.applyForce(arrow, arrow.position, { x: forceX, y: 0 });
      }
      bowState.dx = 0;
      bowState.dy = 0;
      bowState.touched = false;
    } else {
      const drag = touches.find((t: any) => t.type === "move");
      if (knockedArrow && drag) {
        knockedArrow.position.x =
          knockedArrow.position.x + drag.delta.pageX * constants.GAME_SCALE;
        if (knockedArrow.position.x < 50) {
          knockedArrow.position.x = 50;
        } else if (knockedArrow.position.x > constants.KNOCKED_ARROW_ANCHOR.X) {
          knockedArrow.position.x = constants.KNOCKED_ARROW_ANCHOR.X;
        }
        bowState.dx =
          knockedArrow.position.x - constants.KNOCKED_ARROW_ANCHOR.X;
      }
    }
  } else if (touches.find((t: any) => t.type === "start")) {
    bowState.touched = true;
    knockedArrow.visible = true;
  }

  return entities;
};

export { Physics, KnockArrow };
