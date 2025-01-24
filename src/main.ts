import kaplay, { GameObj } from "kaplay";
import * as tiled from "@kayahr/tiled";
import mapData from "../maps/forest_level_1.map.json";
import { drawTiles, setCamScale } from "./utils";
import { SCALE_FACTOR } from "./contants";
import { makePlayer } from "./entities/player";
import { makeDialogueTrigger } from "./entities/dialogueTrigger";
import { CollectableProps, makeCollectable } from "./entities/collectable";
import { makePortal } from "./entities/portal";
import { makeDoor } from "./entities/door";
import { makeGate } from "./entities/gate";

const k = kaplay({
  global: false,
  touchToMouse: true,
  font: "monogram",
  // @ts-expect-error issue with HTMLElement?
  canvas: document.getElementById("game"),
  debug: true, // set to false once ready for production
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.loadSprite("spritesheet", "../maps/tilemap_packed.png", {
  sliceX: 12,
  sliceY: 11,
  anims: {
    player: 112,
    guard: 96,
    greypotion: 113,
    greenpotion: 114,
    redpotion: 115,
    bluepotion: 116,
    hammer: 117,
    axe: 118,
    halfaxe: 119,
    sword: 104,
    staff: 130,
    doorOpen: 21,
    doorClosed: 45,
  },
});

k.loadSprite("Soil", "../maps/Soil_Ground_Tiles.png", {
  sliceX: 11,
  sliceY: 7,
});

k.loadSprite("Grass", "../maps/Grass_Tile_Layers.png", {
  sliceX: 11,
  sliceY: 7,
});

k.loadSprite("Dark grass", "../maps/Darker_Grass_Tile_Layers.png", {
  sliceX: 11,
  sliceY: 7,
});

k.loadSprite("Flowers", "../maps/Mushrooms_Flowers_Tiles.png", {
  sliceX: 12,
  sliceY: 5,
});

k.loadSprite("Bushes", "../maps/Bush_Tiles.png", {
  sliceX: 11,
  sliceY: 11,
});

k.loadSprite("Trees", "../maps/Trees, stumps and bushes.png", {
  sliceX: 12,
  sliceY: 7,
});

k.loadSprite("Fences", "../maps/Fences.png", {
  sliceX: 8,
  sliceY: 4,
});

k.loadSpriteAtlas("../maps/Fence_Gates.png", {
  gateHorizontal: {
    x: 0,
    y: 0,
    width: 320,
    height: 16,
    sliceX: 5,
    anims: {
      opening: { from: 0, to: 4, loop: false },
      closing: { from: 4, to: 0, loop: false },
      open: 4,
      closed: 0,
    },
  },
  gateVertical: {
    x: 0,
    y: 16,
    width: 160,
    height: 64,
    sliceX: 5,
    anims: {
      opening: { from: 0, to: 4, loop: false },
      closing: { from: 4, to: 0, loop: false },
      open: 4,
      closed: 0,
    },
  },
});

k.loadSprite("Signs", "../maps/Signs.png", {
  sliceX: 6,
  sliceY: 4,
});

k.loadSprite("InventoryBlocks", "../maps/InventoryBlocks.png", {
  sliceX: 3,
  sliceY: 3,
  anims: {
    lightLarge: 7,
  },
});

k.loadSprite("ItemShadows", "../maps/ItemShadow.png", {
  sliceX: 1,
  sliceY: 1,
});

k.loadSprite("Items", "../maps/Items.png", {
  sliceX: 8,
  sliceY: 15,
  anims: {
    a: 1,
    b: 9,
    c: 17,
    d: 25,
    e: 33,
    f: 41,
    g: 49,
    h: 57,
    i: 65,
    j: 73,
    k: 81,
    l: 89,
    m: 97,
    n: 105,
    o: 113,
  },
});

k.loadSprite("player", "../maps/Cat_Basic_Spritesheet.png", {
  sliceX: 4,
  sliceY: 4,
  anims: {
    stillDown: { from: 0, to: 1, loop: true },
    runDown: { from: 2, to: 3, loop: true },
    stillUp: { from: 4, to: 5, loop: true },
    runUp: { from: 6, to: 7, loop: true },
    stillLeft: { from: 8, to: 9, loop: true },
    runLeft: { from: 10, to: 11, loop: true },
    stillRight: { from: 12, to: 13, loop: true },
    runRight: { from: 14, to: 15, loop: true },
  },
});

const mapDims = {
  width: mapData.width * mapData.tilewidth * SCALE_FACTOR,
  height: mapData.height * mapData.tileheight * SCALE_FACTOR,
};
// w:960, h:640

k.setBackground(k.Color.fromHex("#000000"));

export interface Entities {
  player: GameObj;
}

k.scene("start", async (): Promise<void> => {
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

          if (spawnPoint.type === "door") {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );

            const door = makeDoor(k, pos, spawnPoint.name);
            map.add(door);
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
              ? (orientationProp.value as string)
              : "horizontal";

            const gate = makeGate(k, pos, spawnPoint.name, orientation);
            map.add(gate);
          }
        });
      }

      if (layer.name === "Portals") {
        layer.objects.forEach((portal) => {
          const newPortal = makePortal(k, portal);
          map.add(newPortal);
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
});

k.go("start");
