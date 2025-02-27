import k from "../kaplayCtx";
import mapData from "../../maps/main_menu.map.json";
import { setCamScale } from "../utils";
import { SCALE_FACTOR } from "../contants";
import { gameState } from "../state";

const mapDims = {
  width: mapData.width * mapData.tilewidth * SCALE_FACTOR,
  height: mapData.height * mapData.tileheight * SCALE_FACTOR,
};

gameState.setMapDimensions(mapDims);

export default function help() {
  k.setCamPos(mapDims.width / 2, mapDims.height / 2);
  setCamScale(k);

  k.setBackground(k.Color.fromHex("#eae178"));

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Objective: Make your way through the maze", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 120),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("opening gates as you go by possesing the", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 90),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("matching item to unlock them.", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 60),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("To complete each level simply get to the", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 30),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("treasure chest hidden in the maze.", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Move: Use arrow keys to move character", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 60),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Press SPACE to go back to main menu", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 120),
    k.anchor("center"),
  ]);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onKeyPress(["space"], () => {
    const nextScene = gameState.setScene("mainMenu");
    k.go(nextScene);
  });
}
