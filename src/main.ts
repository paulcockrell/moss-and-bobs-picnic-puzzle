import kaplay, { GameObj } from "kaplay";
import * as tiled from "@kayahr/tiled";
import mapData from "../maps/level1.map.json";
import { drawTiles, setCamScale } from "./utils";
import { SCALE_FACTOR, SPAWN_Y_OFFSET } from "./contants";
import { makePlayer } from "./entities/player";
import { makeGuard } from "./entities/guard";
import { makeCollectable } from "./entities/collectable";

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
    greenpotion: 114,
    redpotion: 115,
    axe: 118,
    hammer: 116,
  },
});

k.setBackground(k.Color.fromHex("#000000"));

export interface Entities {
  player: GameObj;
  guards: GameObj[];
  collectables: GameObj[];
}

k.scene("start", async (): Promise<void> => {
  const map = k.add([k.pos(0, 0)]);

  const entities: Entities = {
    player: null,
    guards: [],
    collectables: [],
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
              shape: new k.Rect(
                k.vec2(0),
                boundary.width * SCALE_FACTOR,
                boundary.height * SCALE_FACTOR,
              ),
            }),
            k.body({ isStatic: true }),
            k.pos(boundary.x * SCALE_FACTOR, boundary.y * SCALE_FACTOR),
            boundary.name || layer.name,
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

          if (
            ["greenpotion", "redpotion", "hammer", "axe"].includes(
              spawnPoint.name,
            )
          ) {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );
            const collectable = makeCollectable(k, pos, spawnPoint.name);
            entities.collectables.push(collectable);
            k.add(collectable);
          }
        });
      }
    }
  });

  entities.player.onCollide("boundaries", async () => {});

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(entities.player.worldPos().x, entities.player.worldPos().y - 100);
  });
});

k.go("start");
