import k from "../kaplayCtx";
import { setCamScale } from "../utils";
import { SCALE_FACTOR } from "../contants";
import { gameState } from "../state";

export default async function help() {
  const mapData = await k.loadJSON("mainMenuMap", "/maps/main_menu.map.json");

  const mapDims = {
    width: mapData.width * mapData.tilewidth * SCALE_FACTOR,
    height: mapData.height * mapData.tileheight * SCALE_FACTOR,
  };

  gameState.setMapDimensions(mapDims);

  k.setCamPos(mapDims.width / 2, mapDims.height / 2);
  setCamScale(k);

  k.setBackground(k.Color.fromHex("#eae178"));

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("OBJECTIVE", {
      font: "monogram",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 160),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Help Moss find her way to the picnic party!", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 120),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Make your way through the maze", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 90),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("collecting items along the way to", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 60),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("unlock the gates.", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 30),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Hurry, Bob is waiting with the yummy catfood!", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("CONTROLS", {
      font: "monogram",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 60),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Use arrow keys to move", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 100),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Press SPACE to go back to main menu", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 180),
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
