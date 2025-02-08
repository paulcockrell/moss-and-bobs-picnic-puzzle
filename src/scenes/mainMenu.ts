import k from "../kaplayCtx";
import mapData from "../../maps/main_menu.map.json";
import { GameObj } from "kaplay";
import { drawScene, setCamScale } from "../utils";
import { SCALE_FACTOR } from "../contants";
import { gameState } from "../state";

export interface Entities {
  player: GameObj;
}

const mapDims = {
  width: mapData.width * mapData.tilewidth * SCALE_FACTOR,
  height: mapData.height * mapData.tileheight * SCALE_FACTOR,
};

gameState.setMapDimensions(mapDims);

export default function mainMenu() {
  const map = k.add([k.pos(0)]);

  const entities: Entities = {
    player: null,
  };

  drawScene(k, map, mapData, entities);

  k.setCamPos(mapDims.width / 2, mapDims.height / 2);
  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onKeyPress(["space", "enter"], () => {
    const nextScene = gameState.setScene("sceneOne");
    k.go(nextScene);
  });
}
