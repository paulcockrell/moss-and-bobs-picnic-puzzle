import { KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";

export function makeCollectable(k: KAPLAYCtx, pos: Vec2, name: string) {
  return k.make([
    k.sprite("spritesheet", { anim: name }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 16, 16),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    {
      type: name,
    },
    "collectable",
  ]);
}
