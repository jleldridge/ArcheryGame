import Matter from "matter-js";

// const MoveFinger = (entities: any, { touches }: { touches: any }) => {
//   //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
//   //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
//   //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
//   //-- That said, it's probably worth considering performance implications in either case.

//   touches
//     .filter((t: any) => t.type === "move")
//     .forEach((t: any) => {
//       let finger = entities[t.id];
//       if (finger && finger.position) {
//         finger.position = [
//           finger.position[0] + t.delta.pageX,
//           finger.position[1] + t.delta.pageY,
//         ];
//       }
//     });

//   return entities;
// };

// export { MoveFinger };

const Physics = (
  entities: any,
  { touches, time }: { touches: any; time: any }
) => {
  let engine = entities.physics.engine;
  // let target = entities.target.body;

  Matter.Engine.update(engine, time.delta);

  return entities;
};

export { Physics };
