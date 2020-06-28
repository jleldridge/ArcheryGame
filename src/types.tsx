import Matter from "matter-js";

export type RootState = {
  currentScene: Scene;
};

export type Scene = {};

export type GameEntities = {
  physics: Physics;
  bow: Bow;
  arrows: CollidableEntityCollection;
  targets: CollidableEntityCollection;
  obstacles: CollidableEntityCollection;
  debug: Debug;
};

export type Physics = {
  engine: Matter.Engine;
  world: Matter.World;
};

export type Bow = {
  touched: boolean;
  downPoint: Point | null;
  rotation: number;
  drawDistance: number;
  arrowVisible: boolean;
  position: Point;
  renderer: any;
};

export type CollidableEntityCollection = {
  renderer: any;
  items: CollidableEntity[];
};

export type CollidableEntity = {
  body: Matter.Body;
  movePath?: MovePath;
  // renderer: any; // Maybe I could use this at some point to differentiate entities of different types.
};

export type MovePath = {
  waypoints: Point[];
  speed: number;
  index: number;
};

export type Point = {
  x: number;
  y: number;
};

export type ScreenOrientation = "portrait" | "landscape";

export type Debug = {
  showDebug: boolean;
  renderer: any;
  touchDown?: Point;
  dragPoint?: Point;
};
