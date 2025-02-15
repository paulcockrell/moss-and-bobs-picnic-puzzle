import { GameObj, KAPLAYCtx } from "kaplay";
import * as tiled from "@kayahr/tiled";
import { SCALE_FACTOR } from "../contants";
import { makeModal } from "../entities/modal";

export function makeDialogueTrigger(k: KAPLAYCtx, mapObject: tiled.MapObject) {
  const dialogueProp = mapObject.properties?.find(
    (prop) => prop.name === "dialogue" && prop.type === "string",
  );

  const dialogue = dialogueProp
    ? (dialogueProp.value as string)
    : "Hmm, I am ment to collect something!";

  const dialogueTrigger = k.make([
    k.polygon(
      mapObject.polygon.map((mo) => k.vec2(mo.x, mo.y)),
      { triangulate: true, fill: false },
    ),
    k.body({ isStatic: true }),
    k.area(),
    k.anchor("center"),
    k.pos(mapObject.x * SCALE_FACTOR, mapObject.y * SCALE_FACTOR),
    k.scale(SCALE_FACTOR),
    {
      dialogue,
    },
    "dialogueTrigger",
  ]);

  dialogueTrigger.onCollide("player", async (player: GameObj) => {
    player.isInDialogue = true;
    k.play("dialogueTrigger", { loop: false, volume: 1.0 });
    makeModal(k, dialogueTrigger.dialogue, "talk");
  });

  return dialogueTrigger;
}
