import { KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";

export function makeGate(
  k: KAPLAYCtx,
  pos: Vec2,
  name: string,
  orientation: string,
) {
  const sprite =
    orientation === "horizontal"
      ? k.sprite("gateHorizontal", { anim: "closed" })
      : k.sprite("gateVertical", { anim: "closed" });

  const gate = k.make([
    sprite,
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    {
      unlocked: false,
    },
    "gate",
    name,
  ]);

  return gate;
}
