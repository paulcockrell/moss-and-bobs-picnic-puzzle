import { GameObj, KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { MapObject } from "@kayahr/tiled";
import { compArray } from "../utils";

export function makePortal(k: KAPLAYCtx, mapObject: MapObject) {
  const portal = k.make([
    k.area({
      shape: new k.Rect(
        k.vec2(0),
        mapObject.width * SCALE_FACTOR,
        mapObject.height * SCALE_FACTOR,
      ),
    }),
    k.body({ isStatic: true }),
    k.pos(mapObject.x * SCALE_FACTOR, mapObject.y * SCALE_FACTOR),
    {
      properties: mapObject.properties,
    },
    "portal",
  ]);

  portal.onCollideUpdate("player", async (player: GameObj) => {
    // If the user is not walking 'into' the portal then skip teleport
    // Portal doors are only on the vertical plane
    if (["left", "right"].includes(player.direction)) {
      return;
    }

    // Check if the player holds the correct items in his inventory
    // to pass through the portal
    const inventory = k.get("inventory")[0];
    const collectables = inventory.get("collectable");

    const requiredKeys: string[] = portal.properties.reduce(
      (a: string[], b) => [...a, b.value as string],
      [],
    );

    const keys: string[] = collectables.reduce((a: string[], collectable) => {
      const props = collectable.properties;
      return [...a, props.type, props.variant];
    }, []);

    const unlocked = compArray<string>(requiredKeys, keys);
    if (!unlocked) {
      return;
    }

    // hit bottom of portal, move player to top of portal
    if (
      player.pos.y >= portal.pos.y + portal.area.shape.bbox().height / 2 &&
      player.direction === "up"
    ) {
      player.pos.y = portal.pos.y - 16;
      return;
    }

    // hit top of portal, move player to bottom of portal
    if (
      player.pos.y <= portal.pos.y + portal.area.shape.bbox().height / 2 &&
      player.direction === "down"
    ) {
      player.pos.y = portal.pos.y + portal.area.shape.bbox().height + 16;
      return;
    }
  });

  return portal;
}
