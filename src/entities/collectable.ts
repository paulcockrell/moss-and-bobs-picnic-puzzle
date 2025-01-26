import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { addInventoryUI } from "./inventory";

export interface CollectableProps {
  code: string;
}

export function makeCollectable(
  k: KAPLAYCtx,
  pos: Vec2,
  properties: CollectableProps,
) {
  const collectable = k.make([
    k.sprite("ItemsNew", { anim: properties.code }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 16, 16),
    }),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    k.animate(),
    k.z(10),
    {
      properties,
    },
    "collectable",
  ]);

  collectable.onCollide("player", (player) => {
    addCollectableToInventory(k, collectable, player);
  });

  collectable.animate("pos", [pos, k.vec2(pos.x, pos.y - 10)], {
    duration: 1,
    timing: [0, 1 / 1, 0],
    direction: "ping-pong",
    easing: k.easings.easeInOutCirc,
  });

  return collectable;
}

function addCollectableToInventory(
  k: KAPLAYCtx,
  collectable: GameObj,
  player: GameObj,
) {
  addInventoryUI(k, player, collectable.properties.code);
}
