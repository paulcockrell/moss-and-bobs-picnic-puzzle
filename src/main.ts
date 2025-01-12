import kaplay, { GameObj } from "kaplay";
import * as tiled from "@kayahr/tiled";
import mapData from "../maps/level1.map.json";
import { drawTiles, setCamScale } from "./utils";
import { SCALE_FACTOR } from "./contants";
import { makePlayer } from "./entities/player";
import { makeGuard } from "./entities/guard";

const k = kaplay({
  global: false,
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.loadSprite("spritesheet", "../maps/tilemap_packed.png", {
  sliceX: 12,
  sliceY: 11,
  anims: {
    player: 112,
    guard: 96,
  },
});

k.setBackground(k.Color.fromHex("#000000"));

export interface Entities {
  player: GameObj;
  guards: GameObj[];
}

k.scene("start", async (): Promise<void> => {
  const map = k.add([k.pos(0, 0)]);

  const entities: Entities = {
    player: null,
    guards: [],
  };

  mapData.layers.forEach((layer) => {
    // Tiles
    if (tiled.isTileLayer(layer)) {
      drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

    // Objects
    if (tiled.isObjectGroup(layer)) {
      if (layer.name === "Boundaries") {
        layer.objects.forEach((boundary) => {
          map.add([
            k.area({
              shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
            }),
            k.body({ isStatic: true }),
            k.pos(boundary.x, boundary.y),
            boundary.name,
          ]);
        });
      }

      if (layer.name === "SpawnPoints") {
        layer.objects.forEach((spawnPoint) => {
          if (spawnPoint.name === "player") {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );
            const player = makePlayer(k, pos);
            entities.player = player;
            k.add(player);
          }
          if (spawnPoint.name === "guard") {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );
            const guard = makeGuard(k, pos);
            entities.guards.push(guard);
            k.add(guard);
          }
        });
      }
    }
  });

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(entities.player.worldPos().x, entities.player.worldPos().y - 100);
  });
});

k.go("start");
