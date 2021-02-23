import { Application } from "pixi.js";
import { stage } from "./config";

export const game = new Application({
  width: stage.width,
  height: stage.height,
});

console.log(game);

document.body.append(game.view);

export function getRootCantainer() {
  return game.stage;
}
