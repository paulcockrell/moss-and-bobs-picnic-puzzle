import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { compArray } from "../utils";
import { addInventoryUI, getItemFromInventoryUI } from "./inventory";

export interface CollectableProps {
  code: string;
}

export interface CollectableOptions {
  animate: boolean;
  inBasket: boolean;
}

export function makeCollectable(
  k: KAPLAYCtx,
  pos: Vec2,
  properties: CollectableProps,
  options: CollectableOptions = { animate: true, inBasket: false },
) {
  const scaleFactor = SCALE_FACTOR + (options.inBasket ? 1 : 0);
  const collectable = k.make([
    k.sprite("ItemsNew", { anim: properties.code }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 16, 16),
    }),
    k.anchor("center"),
    k.pos(pos),
    k.scale(scaleFactor),
    k.animate(),
    k.z(10),
    {
      properties,
    },
    "collectable",
  ]);

  collectable.onCollide("player", (player) => {
    addCollectableToInventory(k, collectable, player);
    //checkCollectables(k, player);
  });

  if (options.animate) {
    collectable.animate("pos", [pos, k.vec2(pos.x, pos.y - 10)], {
      duration: 1,
      timing: [0, 1 / 1, 0],
      direction: "ping-pong",
      easing: k.easings.easeInOutCirc,
    });
  }

  return collectable;
}

function addCollectableToInventory(
  k: KAPLAYCtx,
  collectable: GameObj,
  player: GameObj,
) {
  addInventoryUI(k, player, collectable.properties.code);
}

/*
 * checkCollectables will look at the players inventory and if they have
 * a complete set then we will mark the corresponding door as open
 */
function checkCollectables(k: KAPLAYCtx, player: GameObj) {
  const inventoryItem = getItemFromInventoryUI(player);

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
