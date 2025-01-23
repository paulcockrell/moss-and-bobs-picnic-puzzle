import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
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
    k.area(),
    k.body({ isStatic: true }),
    {
      unlocked: false,
    },
    "gate",
    name,
  ]);

  gate.onCollide("player", async (player: GameObj) => {
    if (gate.unlocked) return;

    gate.play("opening");
  });

  gate.onUpdate(() => {
    gateOpeningHandler(gate);
  });

  gate.onBeforePhysicsResolve((collision) => {
    if (collision.target.is(["player"]) && gate.unlocked) {
      collision.preventResolution();
    }
  });

  return gate;
}

function gateOpeningHandler(gate) {
  if (gate.unlocked === true) return;

  if (gate.animFrame === 4) {
    gate.unlocked = true;
  }
}
