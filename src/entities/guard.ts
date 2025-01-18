import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { displayDialogue } from "../utils";

export function makeGuard(k: KAPLAYCtx, pos: Vec2, dialogue: string) {
  const guard = k.make([
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
      dialogue: dialogue,
    },
    "guard",
  ]);

  guard.onCollide("player", async (player: GameObj) => {
    player.isInDialogue = true;
    displayDialogue(guard.dialogue, () => {
      player.isInDialogue = false;
    });
  });

  return guard;
}
