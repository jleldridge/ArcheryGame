import Matter from "matter-js";
import * as constants from "../constants";
import * as factory from "./factory";
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
        let arrow = factory.arrow(entities);
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
