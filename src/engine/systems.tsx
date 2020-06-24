import Matter from "matter-js";
import * as constants from "../constants";
import { Arrow } from "./renderers";
import { GameEngineUpdateEventOptionType } from "react-native-game-engine";

export const Physics = (
  entities: any,
  loop: GameEngineUpdateEventOptionType
) => {
  let {
    engine,
    world,
  }: { engine: Matter.Engine; world: Matter.World } = entities.physics;
  const { time } = loop;
  Matter.Engine.update(engine, time.delta);

  let bodiesToRemove: Matter.Body[] = [];
  world.bodies.forEach((body) => {
    if (!Matter.Bounds.overlaps(world.bounds, body.bounds)) {
      bodiesToRemove.push(body);
    }
  });

  bodiesToRemove.forEach((body) => {
    Matter.World.remove(world, body);
    delete entities[body.label];
  });

  return entities;
};

export const KnockArrow = (
  entities: any,
  loop: GameEngineUpdateEventOptionType
) => {
  const { touches } = loop;
  let bowState = entities["bowState"];
  let knockedArrow = entities["knockedArrow"];

  if (bowState.touched) {
    const release = touches.find((t: any) => t.type === "end");
    if (release) {
      const world = entities.physics.world;
      knockedArrow.visible = false;
      knockedArrow.position.x = constants.KNOCKED_ARROW_ANCHOR_X;
      knockedArrow.position.y = constants.KNOCKED_ARROW_ANCHOR_Y;

      if (bowState.dx < 0) {
        let arrow = Matter.Bodies.rectangle(
          knockedArrow.position.x,
          knockedArrow.position.y,
          200,
          40
        );
        arrow.label = `arrow${entities.arrowSuffix++}`;
        arrow.frictionAir = 0;
        Matter.World.add(world, arrow);

        entities[arrow.label] = {
          body: arrow,
          visible: true,
          renderer: Arrow,
        };

        const forceX =
          Math.abs(bowState.dx / constants.MAX_ARROW_PULL_DISTANCE) *
          constants.MAX_ARROW_FORCE;
        Matter.Body.applyForce(arrow, arrow.position, { x: forceX, y: 0 });
      }
      bowState.dx = 0;
      bowState.dy = 0;
      bowState.touched = false;
    } else {
      const drag = touches.find((t: any) => t.type === "move");
      if (knockedArrow && drag && drag.delta) {
        knockedArrow.position.x =
          knockedArrow.position.x + drag.delta.pageX * constants.GAME_SCALE;
        if (knockedArrow.position.x < constants.MIN_KNOCKED_ARROW_X) {
          knockedArrow.position.x = constants.MIN_KNOCKED_ARROW_X;
        } else if (knockedArrow.position.x > constants.KNOCKED_ARROW_ANCHOR_X) {
          knockedArrow.position.x = constants.KNOCKED_ARROW_ANCHOR_X;
        }
        bowState.dx =
          knockedArrow.position.x - constants.KNOCKED_ARROW_ANCHOR_X;
      }
    }
  } else if (touches.find((t: any) => t.type === "start")) {
    bowState.touched = true;
    knockedArrow.visible = true;
  }

  return entities;
};
