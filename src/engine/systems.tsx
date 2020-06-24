import Matter from "matter-js";
import * as constants from "../constants";
import { Arrow } from "./renderers";

const Physics = (
  entities: any,
  { touches, time }: { touches: any; time: any }
) => {
  let engine = entities.physics.engine;

  Matter.Engine.update(engine, time.delta);

  return entities;
};

const KnockArrow = (entities: any, { touches }: { touches: any }) => {
  let bowState = entities["bowState"];
  let knockedArrow = entities["knockedArrow"];

  if (bowState.touched) {
    const release = touches.find((t: any) => t.type === "end");
    if (release) {
      bowState.touched = false;

      const world = entities.physics.world;
      knockedArrow.visible = false;
      knockedArrow.position.x = constants.KNOCKED_ARROW_ANCHOR.X;
      knockedArrow.position.y = constants.KNOCKED_ARROW_ANCHOR.Y;

      let arrow = Matter.Bodies.rectangle(
        knockedArrow.position.x,
        knockedArrow.position.y,
        200,
        40
      );
      Matter.World.add(world, arrow);

      entities["arrow"] = { body: arrow, visible: true, renderer: Arrow };

      Matter.Body.applyForce(arrow, arrow.position, { x: 1, y: 0 });
    } else {
      const drag = touches.find((t: any) => t.type === "move");
      if (knockedArrow && drag) {
        if (knockedArrow && knockedArrow.position) {
          knockedArrow.position.x = Math.min(
            Math.max(
              knockedArrow.position.x + drag.delta.pageX * constants.GAME_SCALE,
              50
            ),
            constants.KNOCKED_ARROW_ANCHOR.X
          );
        }
      }
    }
  } else if (touches.find((t: any) => t.type === "start")) {
    bowState.touched = true;
    knockedArrow.visible = true;
  }

  return entities;
};

export { Physics, KnockArrow };
