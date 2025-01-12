import { KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";

export function makePlayer(k: KAPLAYCtx, pos) {
  return k.make([
    k.sprite("spritesheet", { anim: "player" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 0), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);
}
