import { KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";

export function makeBobcat(k: KAPLAYCtx, pos: Vec2) {
  return k.make([
    k.sprite("bobcat", { anim: "stillDown" }),
    k.area({
      shape: new k.Rect(k.vec2(0), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    k.z(15),
    k.timer(),
    "bob",
  ]);
}
