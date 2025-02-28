import k from "../kaplayCtx";
import { setCamScale } from "../utils";
import { SCALE_FACTOR } from "../contants";
import { gameState } from "../state";

export default async function mainMenu() {
  const mapData = await k.loadJSON("mainMenuMap", "/maps/main_menu.map.json");

  const mapDims = {
    width: mapData.width * mapData.tilewidth * SCALE_FACTOR,
    height: mapData.height * mapData.tileheight * SCALE_FACTOR,
  };

  gameState.setMapDimensions(mapDims);

  k.setCamPos(mapDims.width / 2, mapDims.height / 2);
  setCamScale(k);

  k.setBackground(k.Color.fromHex("#e8b5ac"));

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("CODING", {
      font: "monogram",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 130),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Paul Cockrell (paulcockrell.github.io)", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 100),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("GAME LIBRARY ", {
      font: "monogram",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 50),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Kaplay (kaplayjs.com) ", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 20),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("ARTWORK", {
      font: "monogram",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 30),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Cupnooble (cupnooble.itch.io)", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 60),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("MUSIC", {
      font: "monogram",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 110),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("moodmode (pixabay.com) ", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 140),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Press SPACE to return", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 200),
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
