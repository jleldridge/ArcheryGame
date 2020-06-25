import Matter from "matter-js";
import * as constants from "../constants";
import * as factory from "./factory";
import { GameEngineUpdateEventOptionType } from "react-native-game-engine";
import { toGameCoordinates, getBowRotation, getBowDrawDistance } from "./util";

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
  let bow = entities["bow"];

  if (bowState.touched) {
    const release = touches.find((t: any) => t.type === "end");
    if (release) {
      const world = entities.physics.world;
      bow.arrowVisible = false;
      bow.drawDistance = 0;

      if (bowState.dx < 0) {
        let arrow = factory.arrow(entities);
        const forceX =
          Math.abs(bowState.drawDistance / constants.MAX_ARROW_PULL_DISTANCE) *
          constants.MAX_ARROW_FORCE;
        Matter.Body.applyForce(arrow, arrow.position, { x: forceX, y: 0 });
      }
      bowState.rotation = 0;
      bowState.touched = false;
      bowState.downPoint = null;
      bow.rotation = 0;
    } else {
      const dragTouch = touches.find((t: any) => t.type === "move");
      if (dragTouch) {
        const dragPoint = toGameCoordinates({
          x: dragTouch.event.pageX,
          y: dragTouch.event.pageY,
        });

        bowState.rotation = getBowRotation(dragPoint);
        bowState.drawDistance = getBowDrawDistance(
          bowState.downPoint,
          dragPoint
        );

        bow.rotation = bowState.rotation;
        bow.drawDistance = bowState.drawDistance;
        entities.debug.dragPoint = dragPoint;
      }
    }
  } else {
    const touch = touches.find((t: any) => t.type === "start");
    if (touch) {
      bowState.touched = true;
      bowState.downPoint = toGameCoordinates({
        x: touch.event.pageX,
        y: touch.event.pageY,
      });
      bowState.rotation = getBowRotation(bowState.downPoint);
      bow.rotation = bowState.rotation;
      bow.arrowVisible = true;
      entities.debug.touchDown = bowState.downPoint;
    }
  }

  return entities;
};
