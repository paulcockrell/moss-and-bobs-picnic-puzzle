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

export default function mainMenu() {
  k.setCamPos(mapDims.width / 2, mapDims.height / 2);
  setCamScale(k);

  k.setBackground(k.Color.fromHex("#e8b5ac"));

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Coding: Paul Cockrell (paulcockrell.github.io)", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 80),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Game library: Kaplay (kaplayjs.com) ", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 50),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Artwork: Cupnooble (cupnooble.itch.io)", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 20),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Music: moodmode (pixabay.com) ", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 10),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Press SPACE to return", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 60),
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
