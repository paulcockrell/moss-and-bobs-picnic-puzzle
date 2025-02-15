import k from "../kaplayCtx";
import mapData from "../../maps/main_menu.map.json";
import { GameObj } from "kaplay";
import { drawScene, setCamScale } from "../utils";
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

  const map = k.add([k.pos(0)]);

  drawScene(k, map, mapData);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Mystery Maze", {
      font: "monogram",
      size: 48,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos()),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Press a space to start", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 50),
    k.anchor("center"),
  ]);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onKeyPress(["space"], () => {
    const nextScene = gameState.setScene("levelOne");
    k.go(nextScene);
  });
}
