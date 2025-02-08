import { KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";

const anims = ["stillRightA", "stillRightB", "stillRightC"];

export function makeChicken(k: KAPLAYCtx, pos: Vec2) {
  const chicken = k.make([
    k.sprite("Chickens", { anim: getRandomAnim() }),
    k.area({
      shape: new k.Rect(k.vec2(0), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    k.z(15),
    k.timer(),
    "chicken",
  ]);

  return chicken;
}

function getRandomAnim() {
  return anims[(anims.length * Math.random()) | 0];
}
