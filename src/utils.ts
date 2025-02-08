import { EncodedTileLayer, UnencodedTileLayer } from "@kayahr/tiled";
import { GameObj, KAPLAYCtx, PosComp, Vec2 } from "kaplay";
import * as tiled from "@kayahr/tiled";
import { SCALE_FACTOR } from "./contants";
import { makePlayer } from "./entities/player";
import { CollectableProps, makeCollectable } from "./entities/collectable";
import { GateOrientation, makeGate } from "./entities/gate";
import { Item } from "./entities/inventory";
import { makeDialogueTrigger } from "./entities/dialogueTrigger";
import { gameState } from "./state";
import { makeModal } from "./entities/modal";

export function makeBackground(k: KAPLAYCtx) {
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex("#36A6E0"))]);
}

export function computeRank(score: number) {
  switch (true) {
    case score > 30:
      return "S";
    case score > 20:
      return "A";
    case score > 10:
      return "B";
    case score > 2:
      return "C";
    default:
      return "D";
  }
}

export function goToGame(k: KAPLAYCtx) {
  k.play("confirm");
  k.go("main");
}

export function setCamScale(k: KAPLAYCtx) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.setCamScale(k.vec2(1));
  } else {
    k.setCamScale(k.vec2(1.5));
  }
}

export function drawScene(
  k: KAPLAYCtx,
  map: GameObj<PosComp>,
  mapData: tiled.Map,
  entities: Record<string, any>,
) {
  // Maybe we want to deal with the music outside of the map renderer
  //

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
      if (layer.name === "FinishBoundary") {
        drawFinishBoundary(k, map, layer);
      }

      if (layer.name === "Boundaries") {
        drawBoundaries(k, map, layer);
      }

      if (layer.name === "DialogueTriggers") {
        drawDialogueTriggers(k, map, layer);
      }

      if (layer.name === "SpawnPoints") {
        drawSpawnPoints(k, map, layer, entities);
      }
    }
  });
}
export function drawTiles(
  k: KAPLAYCtx,
  map: GameObj,
  layer: EncodedTileLayer | UnencodedTileLayer,
  tileheight: number,
  tilewidth: number,
  tilesets: tiled.AnyTileset[],
) {
  let nbOfDrawnTiles = 0;
  const tilePos = k.vec2(0);

  // We may have to use custom properties on the layer to reference the tileset use
  // or use naming convenstions of layers / tileset references
  //
  // https://doc.mapeditor.org/en/stable/reference/json-map-format/#json-tileset
  //
  // Each tileset has a firstgid (first global ID) property which tells you the
  // global ID of its first tile (the one with local tile ID 0). This allows
  // you to map the global IDs back to the right tileset, and then calculate
  // the local tile ID by subtracting the firstgid from the global tile ID. The
  // first tileset always has a firstgid value of 1.

  if (tiled.isUnencodedTileLayer(layer)) {
    layer.data.forEach((tile) => {
      if (nbOfDrawnTiles === 0) {
        tilePos.x = 0;
        tilePos.y = 0;
      } else if (nbOfDrawnTiles % layer.width === 0) {
        tilePos.x = 0;
        tilePos.y += tileheight * SCALE_FACTOR;
      } else {
        tilePos.x += tilewidth * SCALE_FACTOR;
      }

      nbOfDrawnTiles++;
      if (tile > 0) {
        const tileset = tilesets.find((ts) => tile >= ts.firstgid);
        map.add([
          k.sprite(layer.name, { frame: tile - (tileset?.firstgid || 0) }),
          k.pos(tilePos),
          k.offscreen(),
          k.scale(SCALE_FACTOR),
        ]);
      }
    });
  }
}

export function drawDialogueTriggers(
  k: KAPLAYCtx,
  map: GameObj<PosComp>,
  layer: tiled.AnyLayer,
) {
  layer.objects.forEach((dialogueTrigger) => {
    map.add(makeDialogueTrigger(k, dialogueTrigger));
  });
}

export function drawFinishBoundary(
  k: KAPLAYCtx,
  map: GameObj<PosComp>,
  layer: tiled.AnyLayer,
) {
  layer.objects.forEach((boundary) => {
    const finish = map.add([
      k.polygon(
        boundary.polygon.map((p) => k.vec2(p.x, p.y)),
        { triangulate: true, fill: false },
      ),
      k.scale(SCALE_FACTOR),
      k.body({ isStatic: true }),
      k.area(),
      k.pos(boundary.x * SCALE_FACTOR, boundary.y * SCALE_FACTOR),
      "finish",
    ]);

    finish.onCollide("player", (player) => {
      gameState.setMode("won");

      makeModal(k, "Hurray we completed level 1!", "happy", () =>
        gameState.setMode("finished"),
      );
    });
  });
}

export function drawSpawnPoints(
  k: KAPLAYCtx,
  map: GameObj<PosComp>,
  layer: tiled.AnyLayer,
  entities: Record<string, any>,
) {
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

export function drawBoundaries(
  k: KAPLAYCtx,
  map: GameObj,
  layer: tiled.AnyLayer,
) {
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

export function generateColliderBoxComponents(
  k: KAPLAYCtx,
  width: number,
  height: number,
  pos: Vec2,
  tag: string,
) {
  return [
    k.rect(width, height),
    k.pos(pos.x, pos.y + 16),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    k.offscreen(),
    tag,
  ];
}

export async function fetchMapData(mapPath: string) {
  return await (await fetch(mapPath)).json();
}

export function areAnyOfTheseKeysDown(k: KAPLAYCtx, keys: string[]) {
  for (const key of keys) {
    if (k.isKeyDown(key)) return true;
  }

  return false;
}

export function compArray<T>(arr1: T[], arr2: T[]) {
  return arr1.length === arr2.length && arr1.every((el) => arr2.includes(el));
}
