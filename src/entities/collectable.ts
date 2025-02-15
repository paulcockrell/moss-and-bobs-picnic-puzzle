import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { addInventoryUI, Color, Item } from "./inventory";

export interface CollectableProps {
  item: Item;
  color: Color;
}

export function makeCollectable(
  k: KAPLAYCtx,
  pos: Vec2,
  properties: CollectableProps,
) {
  const anim = generateCollectableCode(properties);

  const collectable = k.make([
    k.sprite("ItemsNew", { anim }),
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
    addInventoryUI(k, player, collectable.properties);
  });

  collectable.animate("pos", [pos, k.vec2(pos.x, pos.y - 10)], {
    duration: 1,
    timing: [0, 1 / 1, 0],
    direction: "ping-pong",
    easing: k.easings.easeInOutCirc,
  });

  return collectable;
}

export function generateCollectableCode({
  item,
  color,
}: CollectableProps): string {
  return `${item}${color.charAt(0).toUpperCase() + color.slice(1)}`;
}

export function collectablesMatch(
  collectable1?: CollectableProps,
  collectable2?: CollectableProps,
): boolean {
  if (!collectable1 || !collectable2) return false;

  if (
    (collectable1.color === "any" || collectable2.color === "any") &&
    collectable1.item === collectable2.item
  ) {
    return true;
  }

  if (
    (collectable1.item === "color" || collectable2.item === "color") &&
    collectable1.color === collectable2.color
  ) {
    return true;
  }

  return (
    collectable1.item === collectable2.item &&
    collectable1.color === collectable2.color
  );
}
