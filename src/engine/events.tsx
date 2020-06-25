import Matter from "matter-js";
import * as ScreenOrientation from "expo-screen-orientation";
import { Dimensions } from "react-native";

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

export function attachOrientationEvents() {
  ScreenOrientation.addOrientationChangeListener(
    async (e: ScreenOrientation.OrientationChangeEvent) => {
      const orientation = await ScreenOrientation.getOrientationAsync();
      console.log(orientation);
      console.log(Dimensions.get("window").height);
    }
  );
}
