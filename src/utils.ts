import { EncodedTileLayer, UnencodedTileLayer } from "@kayahr/tiled";
import { GameObj, KAPLAYCtx } from "kaplay";
import * as tiled from "@kayahr/tiled";
import { SCALE_FACTOR } from "./contants";

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

export function drawBoundaries(k, map, layer) {
  for (const object of layer.objects) {
    map.add(
      generateColliderBoxComponents(
        k,
        object.width,
        object.height,
        k.vec2(object.x, object.y),
        object.name !== "" ? object.name : "wall",
      ),
    );
  }
}

export function generateColliderBoxComponents(k, width, height, pos, tag) {
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

export async function fetchMapData(mapPath) {
  return await (await fetch(mapPath)).json();
}

export function areAnyOfTheseKeysDown(k, keys) {
  for (const key of keys) {
    if (k.isKeyDown(key)) return true;
  }

  return false;
}

export function compArray<T>(arr1: T[], arr2: T[]) {
  return arr1.length === arr2.length && arr1.every((el) => arr2.includes(el));
}
