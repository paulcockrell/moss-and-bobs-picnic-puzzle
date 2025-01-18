import { KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";

export interface CollectableProps {
  type: string;
  variant: string;
}

export function makeCollectable(
  k: KAPLAYCtx,
  pos: Vec2,
  name: string,
  properties: CollectableProps,
) {
  const collectable = k.make([
    k.sprite("spritesheet", { anim: name }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 16, 16),
    }),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    {
      name: name,
      properties,
    },
    "collectable",
    properties.type,
  ]);

  collectable.onCollide("player", (player) => {
    const inventory = k.get("inventory")[0];
    const matchingInventoryItem = inventory.get([
      "collectable",
      collectable.properties.type,
    ])[0];

    // We can only hold one type of item at a time
    if (matchingInventoryItem) {
      k.destroy(matchingInventoryItem);
    }

    const allInventory = inventory.get("collectable");
    const pos =
      matchingInventoryItem?.pos ||
      k.vec2(
        allInventory.length * (SCALE_FACTOR * 16) + 20 /* padding */,
        inventory.pos.y + 20,
      );

    const newCollectable = makeCollectable(
      k,
      pos,
      collectable.name,
      collectable.properties,
    );

    inventory.add(newCollectable);
  });

  return collectable;
}
