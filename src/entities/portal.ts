import { KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { MapObject } from "@kayahr/tiled";

export function makePortal(k: KAPLAYCtx, portal: MapObject) {
  return k.make([
    k.area({
      shape: new k.Rect(
        k.vec2(0),
        portal.width * SCALE_FACTOR,
        portal.height * SCALE_FACTOR,
      ),
    }),
    k.body({ isStatic: true }),
    k.pos(portal.x * SCALE_FACTOR, portal.y * SCALE_FACTOR),
    {
      properties: portal.properties,
    },
    "portal",
  ]);
}
