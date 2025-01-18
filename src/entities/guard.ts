import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { displayDialogue } from "../utils";

export function makeGuard(
  k: KAPLAYCtx,
  pos: Vec2,
  door: string,
  dialogue: string,
) {
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
      door,
      dialogue,
    },
    "guard",
  ]);

  guard.onCollide("player", async (player: GameObj) => {
    const door = k.get(guard.door)[0];
    if (door.unlocked) return;

    player.isInDialogue = true;
    displayDialogue(guard.dialogue, () => {
      player.isInDialogue = false;
    });
  });

  return guard;
}

function getGuardsDoor(k: KAPLAYCtx, guard: GameObj) {}
