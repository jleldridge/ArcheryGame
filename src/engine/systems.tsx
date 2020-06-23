import Matter from "matter-js";
import * as constants from "../constants";

const Physics = (
  entities: any,
  { touches, time }: { touches: any; time: any }
) => {
  let engine = entities.physics.engine;

  let bowState = entities["bowState"];

  if (bowState.touched) {
    const release = touches.find((t: any) => t.type === "end");
    if (release) {
      console.log("trying to launch arrow");
      bowState.touched = false;
      const arrow = entities["knockedArrow"].body;
      Matter.Body.applyForce(arrow, arrow.position, { x: 1, y: 0 });
    } else {
      let knockedArrow = entities["knockedArrow"];
      const drag = touches.find((t: any) => t.type === "move");
      if (knockedArrow && drag) {
        if (knockedArrow && knockedArrow.body.position) {
          knockedArrow.body.position.x = Math.min(
            Math.max(
              knockedArrow.body.position.x +
                drag.delta.pageX * constants.GAME_SCALE,
              50
            ),
            constants.KNOCKED_ARROW_ANCHOR.X
          );
        }
      }
    }
  } else if (touches.find((t: any) => t.type === "start")) {
    bowState.touched = true;
  }

  Matter.Engine.update(engine, time.delta);

  return entities;
};

const KnockArrow = (entities: any, { touches }: { touches: any }) => {
  // let bowState = entities["bowState"];

  // if (bowState.touched) {
  //   const release = touches.find((t: any) => t.type === "end");
  //   if (release) {
  //     console.log("trying to launch arrow");
  //     bowState.touched = false;
  //     const arrow = entities["knockedArrow"].body;
  //     Matter.Body.applyForce(arrow, arrow.position, { x: 1, y: 0 });
  //   } else {
  //     let knockedArrow = entities["knockedArrow"];
  //     const drag = touches.find((t: any) => t.type === "move");
  //     if (knockedArrow && drag) {
  //       if (knockedArrow && knockedArrow.body.position) {
  //         knockedArrow.body.position.x = Math.min(
  //           Math.max(knockedArrow.body.position.x + drag.delta.pageX, 50),
  //           constants.KNOCKED_ARROW_ANCHOR.X
  //         );
  //       }
  //     }
  //   }
  // } else if (touches.find((t: any) => t.type === "start")) {
  //   bowState.touched = true;
  // }

  return entities;
};

export { Physics, KnockArrow };
