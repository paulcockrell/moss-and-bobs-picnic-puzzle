import k from "../kaplayCtx";
import * as tiled from "@kayahr/tiled";
import mapData from "../../maps/forest_level_1.map.json";
import { drawTiles, setCamScale } from "../utils";
import { SCALE_FACTOR } from "../contants";
import { makePlayer } from "../entities/player";
import { makeDialogueTrigger } from "../entities/dialogueTrigger";
import { CollectableProps, makeCollectable } from "../entities/collectable";
import { GateOrientation, makeGate } from "../entities/gate";
import { Item } from "../entities/inventory";
import { GameObj } from "kaplay";

export interface Entities {
  player: GameObj;
}

const mapDims = {
  width: mapData.width * mapData.tilewidth * SCALE_FACTOR,
  height: mapData.height * mapData.tileheight * SCALE_FACTOR,
};
// w:960, h:640

export default function sceneOne() {
  k.play("music", { loop: true, volume: 0.4 });
  const map = k.add([k.pos(0, 0)]);

  const entities: Entities = {
    player: null,
  };

  // This builds an array of `firstgid` values (from Tiled mapdata) that
  // represent the first unique spritesheet icon value per spritesheet used by
  // the Tiled map. We use this to cross-reference a tile value found in
  // a layer as we draw it in Kaplay with the first spritesheet where
  // `tileNumber >= firstgid`. This way we know which spritesheet to draw from,
  // and which icon within it to use.
  const sortedTilesetsDesc = mapData.tilesets.sort(
    (ts1, ts2) => ts2.firstgid - ts1.firstgid,
  );

  mapData.layers.forEach((layer) => {
    if (tiled.isTileLayer(layer)) {
      drawTiles(
        k,
        map,
        layer,
        mapData.tileheight,
        mapData.tilewidth,
        sortedTilesetsDesc,
      );
    }

    // Objects
    if (tiled.isObjectGroup(layer)) {
      if (layer.name === "Boundaries") {
        layer.objects.forEach((boundary) => {
          map.add([
            k.polygon(
              boundary.polygon.map((p) => k.vec2(p.x, p.y)),
              { triangulate: true, fill: false },
            ),
            k.scale(SCALE_FACTOR),
            k.body({ isStatic: true }),
            k.area(),
            k.pos(boundary.x * SCALE_FACTOR, boundary.y * SCALE_FACTOR),
            "boundary",
          ]);
        });
      }

      if (layer.name === "DialogueTriggers") {
        layer.objects.forEach((dialogueTrigger) => {
          map.add(makeDialogueTrigger(k, dialogueTrigger));
        });
      }

      if (layer.name === "SpawnPoints") {
        layer.objects.forEach((spawnPoint) => {
          if (spawnPoint.type === "player") {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );
            const player = makePlayer(k, pos);
            entities.player = player;
            map.add(player);
          }

          if (spawnPoint.type === "collectable") {
            const props = spawnPoint.properties.reduce(
              (a, b) => ({ ...a, [b.name]: b.value }),
              {},
            ) as CollectableProps;

            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );

            const collectable = makeCollectable(k, pos, props);

            map.add(collectable);
          }

          if (spawnPoint.type === "gate") {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );

            const orientationProp = spawnPoint.properties?.find(
              (prop) => prop.name === "orientation" && prop.type === "string",
            );

            const orientation = orientationProp
              ? (orientationProp.value as GateOrientation)
              : "horizontal";

            const codeProp = spawnPoint.properties?.find(
              (prop) => prop.name === "code" && prop.type === "string",
            );

            const code = codeProp ? (codeProp.value as Item) : "eggGreen";

            const gate = makeGate(k, pos, spawnPoint.name, {
              orientation,
              code,
            });

            map.add(gate);
          }
        });
      }
    }
  });

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  // Implement a semi-sticky camera. It will follow the player upto predefined
  // limits based on the size of the map and then the camera 'sticks' in place
  // and the character moves within the map
  k.onUpdate(() => {
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
