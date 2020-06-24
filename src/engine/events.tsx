import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";

export function attachMatterEvents(engine: Matter.Engine) {
  Matter.Events.on(
    engine,
    "collisionStart",
    (e: Matter.IEventCollision<Matter.Body>) => {
      e.pairs.forEach((pair) => {
        let arrow = pair.bodyA.label.startsWith("arrow")
          ? pair.bodyA
          : pair.bodyB.label.startsWith("arrow")
          ? pair.bodyB
          : undefined;
        let target = pair.bodyA.label.startsWith("target")
          ? pair.bodyA
          : pair.bodyB.label.startsWith("target")
          ? pair.bodyB
          : undefined;
        if (arrow && target) {
          // mark target for removal
          Matter.World.remove(engine.world, target);
        }
      });
    }
  );
}
