import { KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";

export function makeGuard(k: KAPLAYCtx, pos) {
  return k.make([
    k.sprite("spritesheet", { anim: "guard" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 16, 16),
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
    "guard",
  ]);
}
