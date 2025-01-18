import { KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";

export function makeDoor(k: KAPLAYCtx, pos: Vec2, name: string) {
  const door = k.make([
    k.sprite("spritesheet", { anim: "doorClosed" }),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    "door",
    name,
  ]);

  // guard.onCollide("player", async (player: GameObj) => {
  //   player.isInDialogue = true;
  //   displayDialogue(guard.dialogue, () => {
  //     player.isInDialogue = false;
  //   });
  // });

  return door;
}
