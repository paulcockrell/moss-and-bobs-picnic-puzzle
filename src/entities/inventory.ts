import { GameObj, KAPLAYCtx } from "kaplay";
import { emitParticles } from "./particles";
import { SCALE_FACTOR } from "../contants";
import {
  CollectableProps,
  collectablesMatch,
  generateCollectableCode,
} from "./collectable";

export type Item = "milk" | "egg" | "mushroom" | "color";
export type Color = "red" | "green" | "blue" | "any";

export const ItemToHumanMap = {
  milkAny: "some cow juice",
  milkRed: "some red cow juice",
  milkGreen: "some green cow juice",
  milkBlue: "some blue cow juice",
  eggAny: "an egg",
  eggRed: "a red egg",
  eggGreen: "a green egg",
  eggBlue: "a blue egg",
  mushroomAny: "a mushroom",
  mushroomRed: "a red mushroom",
  mushroomGreen: "a green mushroom",
  mushroomBlue: "a blue mushroom",
  colorRed: "any red item",
  colorGreen: "any green item",
  colorBlue: "any blue item",
};

export function getItemFromInventoryUI(
  player: GameObj,
): CollectableProps | null {
  return player.inventoryUI?.properties;
}

export function removeInventoryUI(k: KAPLAYCtx, player: GameObj) {
  const inventoryUI = player.inventoryUI;

  if (inventoryUI) {
    k.destroy(inventoryUI);
  }
}

export function addInventoryUI(
  k: KAPLAYCtx,
  player: GameObj,
  collectable: CollectableProps,
) {
  const currentItem = getItemFromInventoryUI(player);
  const newItem = calculateNextItem(currentItem, collectable);

  if (collectablesMatch(currentItem, newItem)) {
    return;
  }

  removeInventoryUI(k, player);

  player.inventoryUI = player.add([
    k.sprite("ItemsNew", { anim: generateCollectableCode(newItem) }),
    k.anchor("center"),
    k.pos(0, -20),
    {
      properties: {
        ...newItem,
      },
    },
  ]);

  emitParticles(
    k,
    k.vec2(
      player.pos.x - 0 * SCALE_FACTOR, // center of players head
      player.pos.y - 20 * SCALE_FACTOR, // above players head, roughly where the inventory icon is
    ),
  );

  k.play("collect", { loop: false, volume: 1.0 });
}

function calculateNextItem(
  currentItem: CollectableProps | null | undefined,
  newItem: CollectableProps,
): CollectableProps {
  // We have no existing item, so return new item
  if (!currentItem) {
    return { ...newItem };
  }

  // If we have just picked up a color, then change the color of the existing
  // item
  if (newItem.item === "color") {
    return { ...currentItem, color: newItem.color };
  }

  // If we have picked up a blank item (an item with no color) then change
  // existing items type while preserving the existing items color
  if (newItem.color === "any") {
    return { ...currentItem, item: newItem.item };
  }

  // We have picked up a colored item so return
  return { ...newItem };
}
