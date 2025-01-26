import { GameObj, KAPLAYCtx } from "kaplay";
import { emitParticles } from "./particles";
import { SCALE_FACTOR } from "../contants";

export type Item =
  | "milkAny"
  | "milkRed"
  | "milkGreen"
  | "milkBlue"
  | "eggAny"
  | "eggRed"
  | "eggGreen"
  | "eggBlue"
  | "mushroomAny"
  | "mushroomRed"
  | "mushroomGreen"
  | "mushroomBlue"
  | "colorRed"
  | "colorGreen"
  | "colorBlue";

export const ItemToHumanMap = {
  milkAny: "some milk of any color",
  milkRed: "some red cow juice",
  milkGreen: "some green cow juice",
  milkBlue: "some blue cow juice",
  eggAny: "an egg of any color",
  eggRed: "a red egg",
  eggGreen: "a green egg",
  eggBlue: "a blue egg",
  mushroomAny: "a mushroom of any color",
  mushroomRed: "a red mushroom",
  mushroomGreen: "a green mushroom",
  mushroomBlue: "a blue mushroom",
  colorRed: "the color red",
  colorGreen: "the color green",
  colorBlue: "the color blue",
};

export interface ItemProps {
  code: Item;
}

export function getItemFromInventoryUI(player: GameObj): Item | null {
  const item = player.inventoryUI?.properties.code;
  return item;
}

export function removeInventoryUI(k: KAPLAYCtx, player: GameObj) {
  const inventoryUI = player.inventoryUI;

  if (inventoryUI) {
    k.destroy(inventoryUI);
  }
}

export function addInventoryUI(k: KAPLAYCtx, player: GameObj, itemName: Item) {
  const currentItem = getItemFromInventoryUI(player);
  const calculatedItem = calculateNewItem(currentItem, itemName);

  if (currentItem === calculatedItem) {
    return;
  }

  removeInventoryUI(k, player);

  player.inventoryUI = player.add([
    k.sprite("ItemsNew", { anim: calculatedItem }),
    k.anchor("center"),
    k.pos(0, -20),
    {
      properties: {
        code: calculatedItem,
      },
    },
  ]);

  emitParticles(
    k,
    k.vec2(
      player.pos.x - (16 / 2) * SCALE_FACTOR, // center of players head
      player.pos.y, // above players head, roughly where the inventory icon is
    ),
  );
}

function calculateNewItem(
  currentItem: Item | null | undefined,
  newItem: Item,
): Item {
  // We have no existing item, so return new item
  if (!currentItem) {
    return newItem;
  }

  // If we have just picked up a color, then change the color of the existing
  // item
  if (newItem.match(/colorRed|colorBlue|colorGreen/)) {
    const newColor = newItem.replace("color", "");
    const updatedItem = currentItem.replace(/Any|Red|Green|Blue/, newColor);

    return updatedItem as Item;
  }

  // If we have picked up a blank item (an item with no color) then change
  // existing items type while preserving the existing items color
  if (newItem.match(/milkAny|eggAny|mushroomAny/)) {
    const newType = newItem.replace("Any", "");
    const updatedItem = currentItem.replace(/milk|egg|mushroom/, newType);

    return updatedItem as Item;
  }

  // We have picked up a colored item so return
  return newItem as Item;
}
