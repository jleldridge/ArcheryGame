import Matter from "matter-js";

export function attachMatterEvents(engine: Matter.Engine) {
  Matter.Events.on(
    engine,
    "collisionStart",
    (e: Matter.IEventCollision<Matter.Body>) => {
      e.pairs.forEach((pair) => {
        let arrow =
          pair.bodyA.label === "arrows"
            ? pair.bodyA
            : pair.bodyB.label === "arrows"
            ? pair.bodyB
            : undefined;
        let target =
          pair.bodyA.label === "targets"
            ? pair.bodyA
            : pair.bodyB.label === "targets"
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
