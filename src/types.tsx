import Matter from "matter-js";

export type RootState = {
  currentScene: Scene;
};

export type Scene = {};

export type GameEntities = {
  entitySuffix: number;
  physics: Physics;
  bow: Bow;
  target: Target;
  debug: any;
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

export type Target = {
  body: Matter.Body;
  movePath: MovePath;
  renderer: any;
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
