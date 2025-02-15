import k from "../kaplayCtx";
import mapData from "../../maps/forest_level_2.map.json";
import { GameObj } from "kaplay";
import { drawScene, setCamScale } from "../utils";
import { SCALE_FACTOR } from "../contants";
import { makeModal } from "../entities/modal";
import { gameState } from "../state";
import { addInventoryUI } from "../entities/inventory";

const mapDims = {
  width: mapData.width * mapData.tilewidth * SCALE_FACTOR,
  height: mapData.height * mapData.tileheight * SCALE_FACTOR,
};

gameState.setMapDimensions(mapDims);

export default function levelTwo() {
  const map = k.add([k.pos(0)]);
  const bgMusic = k.play("music", { loop: true, volume: 0.4 });
  const entities = drawScene(k, map, mapData);

  k.setCamPos(mapDims.width / 2, mapDims.height / 2);
  setCamScale(k);

  gameState.setMode("intro");
  makeModal(k, "Level two. This looks harder!", "talk", () =>
    gameState.setMode("playing"),
  );

  k.onResize(() => {
    setCamScale(k);
  });

  // Implement a semi-sticky camera. It will follow the player upto predefined
  // limits based on the size of the map and then the camera 'sticks' in place
  // and the character moves within the map
  let lastGameMode = "";

  k.onUpdate(() => {
    // When the intro modal is shown
    if (gameState.getMode() === "intro") {
      lastGameMode = gameState.getMode();

      k.setCamPos(mapDims.width / 2, mapDims.height / 2);
      k.setCamScale(k.vec2(1.5));

      return;
    }

    // Move camera from center of map to focus on the player
    if (lastGameMode === "intro" && gameState.getMode() === "playing") {
      lastGameMode = gameState.getMode();

      // Add player inventory with a starting item present
      addInventoryUI(k, entities.player, { item: "egg", color: "red" });

      let newPosX = entities.player.worldPos().x;
      let newPosY = entities.player.worldPos().y;

      if (newPosX >= (mapDims.width / 10) * 6) {
        newPosX = (mapDims.width / 10) * 6;
      } else if (newPosX <= (mapDims.width / 10) * 4) {
        newPosX = (mapDims.width / 10) * 4;
      }

      if (newPosY >= (mapDims.height / 10) * 6) {
        newPosY = (mapDims.height / 10) * 6;
      } else if (newPosY <= (mapDims.height / 10) * 4) {
        newPosY = (mapDims.height / 10) * 4;
      }

      k.tween(k.getCamPos(), k.vec2(newPosX, newPosY), 1, (value) =>
        k.setCamPos(value),
      ).then(() => {
        gameState.setMode("playing");
      });

      return;
    }

    if (lastGameMode !== "won" && gameState.getMode() === "won") {
      lastGameMode = gameState.getMode();

      // stop game music
      bgMusic.stop();
      // play win music
      k.play("win", { loop: false, volume: 1.0 });
    }

    if (lastGameMode !== "finished" && gameState.getMode() === "finished") {
      lastGameMode = gameState.getMode();

      const nextScene = gameState.setScene("ending");
      k.go(nextScene);

      return;
    }

    // follow the player upto the limits
    let newPosX = entities.player.worldPos().x;
    let newPosY = entities.player.worldPos().y;

    if (newPosX >= (mapDims.width / 10) * 6) {
      newPosX = (mapDims.width / 10) * 6;
    } else if (newPosX <= (mapDims.width / 10) * 4) {
      newPosX = (mapDims.width / 10) * 4;
    }

    if (newPosY >= (mapDims.height / 10) * 6) {
      newPosY = (mapDims.height / 10) * 6;
    } else if (newPosY <= (mapDims.height / 10) * 4) {
      newPosY = (mapDims.height / 10) * 4;
    }

    k.setCamPos(newPosX, newPosY);
  });
}
