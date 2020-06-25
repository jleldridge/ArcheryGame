import Matter from "matter-js";
import * as constants from "../constants";
import * as factory from "./factory";
import { GameEngineUpdateEventOptionType } from "react-native-game-engine";
import {
  toGameCoordinates,
  getBowRotation,
  getBowDrawDistance,
  getArrowForceVector,
} from "./util";

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
  let bow = entities["bow"];

  if (bow.touched) {
    const release = touches.find((t: any) => t.type === "end");
    if (release) {
      bow.arrowVisible = false;

      if (bow.drawDistance < 0) {
        let arrow = factory.arrow(entities);
        Matter.Body.rotate(arrow, bow.rotation);

        Matter.Body.applyForce(
          arrow,
          arrow.position,
          getArrowForceVector(bow.drawDistance, bow.rotation)
        );
      }
      bow.rotation = 0;
      bow.touched = false;
      bow.downPoint = null;
    } else {
      const dragTouch = touches.find((t: any) => t.type === "move");
      if (dragTouch) {
        const dragPoint = toGameCoordinates({
          x: dragTouch.event.pageX,
          y: dragTouch.event.pageY,
        });

        bow.rotation = getBowRotation(dragPoint);
        bow.drawDistance = getBowDrawDistance(bow.downPoint, dragPoint);

        entities.debug.dragPoint = dragPoint;
      }
    }
  } else {
    const touch = touches.find((t: any) => t.type === "start");
    if (touch) {
      bow.touched = true;
      bow.downPoint = toGameCoordinates({
        x: touch.event.pageX,
        y: touch.event.pageY,
      });
      bow.rotation = getBowRotation(bow.downPoint);
      bow.arrowVisible = true;
      entities.debug.touchDown = bow.downPoint;
    }
  }

  return entities;
};
