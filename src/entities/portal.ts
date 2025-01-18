import { GameObj, KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { MapObject } from "@kayahr/tiled";

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

    const door = k.get(
      portal.properties.find((p) => p.name === "door").value as string,
    )[0];

    if (!door.unlocked) {
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
