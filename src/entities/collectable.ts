import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { compArray } from "../utils";

export interface CollectableProps {
  code: string;
}

export function makeCollectable(
  k: KAPLAYCtx,
  pos: Vec2,
  name: string,
  properties: CollectableProps,
) {
  const collectable = k.make([
    k.sprite("Items", { anim: properties.code }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 16, 16),
    }),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    k.animate(),
    {
      properties,
    },
    "collectable",
    properties.code,
  ]);

  collectable.onCollide("player", (player) => {
    addCollectableToInventory(k, collectable);
    checkCollectables(k);
  });

  collectable.animate("pos", [pos, k.vec2(pos.x, pos.y - 10)], {
    duration: 1,
    timing: [0, 1 / 1, 0],
    direction: "ping-pong",
    easing: k.easings.easeInOutCirc,
  });

  return collectable;
}

function addCollectableToInventory(k, collectable) {
  const inventory = k.get("inventory")[0];
  const matchingInventoryItem = inventory.get([
    "collectable",
    collectable.code,
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
}

/*
 * checkCollectables will look at the players inventory and if they have
 * a complete set then we will mark the corresponding door as open
 */
function checkCollectables(k: KAPLAYCtx) {
  const inventory = k.get("inventory")[0];
  const collectables = inventory.get("collectable");

  const keys: string[] = collectables.reduce((a: string[], collectable) => {
    const props = collectable.properties;
    return [...a, props.type, props.variant];
  }, []);

  const dave = k.get("portal");
  k.get("portal").forEach((portal: GameObj) => {
    // load door connected to portal
    const door = k.get(
      portal.properties.find((p) => p.name === "door").value as string,
    )[0];

    // get the keys required to open the door
    const requiredKeys: string[] = portal.properties
      .filter((p) => p.name.startsWith("key"))
      .reduce((a: string[], b) => [...a, b.value as string], []);

    const unlocked = compArray<string>(requiredKeys, keys);
    if (!unlocked) {
      door.play("doorClosed");
      door.unlocked = false;
    } else {
      door.play("doorOpen");
      door.unlocked = true;
    }
  });
}
