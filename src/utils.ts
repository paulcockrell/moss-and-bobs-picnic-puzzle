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

export function displayDialogue(text: string, onDisplayEnd: () => void) {
  const dialogueUI = document.getElementById("textbox-container");
  const dialogue = document.getElementById("dialogue");

  dialogueUI.style.display = "block";
  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialogue.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 1);

  const closeBtn = document.getElementById("close");

  function onCloseBtnClick() {
    onDisplayEnd();
    dialogueUI.style.display = "none";
    dialogue.innerHTML = "";
    clearInterval(intervalRef);
    closeBtn.removeEventListener("click", onCloseBtnClick);
  }

  closeBtn.addEventListener("click", onCloseBtnClick);

  addEventListener("keypress", (key) => {
    if (key.code === "Enter") {
      closeBtn.click();
    }
  });
}

export function drawTiles(
  k: KAPLAYCtx,
  map: GameObj,
  layer: EncodedTileLayer | UnencodedTileLayer,
  tileheight: number,
  tilewidth: number,
) {
  let nbOfDrawnTiles = 0;
  const tilePos = k.vec2(0, 100);

  if (tiled.isUnencodedTileLayer(layer)) {
    layer.data.forEach((tile) => {
      if (nbOfDrawnTiles % layer.width === 0) {
        tilePos.x = 0 * SCALE_FACTOR;
        tilePos.y += tileheight * SCALE_FACTOR;
      } else {
        tilePos.x += tilewidth * SCALE_FACTOR;
      }

      nbOfDrawnTiles++;
      if (tile > 0) {
        map.add([
          k.sprite("spritesheet", { frame: tile - 1 }),
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

export async function fetchMapData(mapPath) {
  return await (await fetch(mapPath)).json();
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

export function areAnyOfTheseKeysDown(k, keys) {
  for (const key of keys) {
    if (k.isKeyDown(key)) return true;
  }

  return false;
}
