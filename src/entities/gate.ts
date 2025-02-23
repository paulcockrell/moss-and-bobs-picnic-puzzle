import { AreaCompOpt, GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { getItemFromInventoryUI, ItemToHumanMap } from "./inventory";
import { makeModal } from "./modal";
import {
  CollectableProps,
  collectablesMatch,
  generateCollectableCode,
} from "./collectable";

export type GateOrientation = "horizontal" | "vertical";

export type GateProps = {
  orientation: GateOrientation;
} & CollectableProps;

const status: "closed" | "open" | "closing" | "opening" = "closed";

export function makeGate(
  k: KAPLAYCtx,
  pos: Vec2,
  name: string,
  properties: GateProps = {
    orientation: "horizontal",
    item: "egg",
    color: "green",
  },
) {
  const sprite =
    properties.orientation === "horizontal"
      ? k.sprite("gateHorizontal", { anim: "closed" })
      : k.sprite("gateVertical", { anim: "closed" });

  // As the vertical sprite shape is wide to accomodate the open gate doors it
  // meas the collision area for the sprite is the same dimensions meaning you
  // collide with the gate from the side the gate doors open into early as you
  // are not touching it when the doors are closed, but you are in contact with
  // the collision area.
  // To solve this we create a custom shape for the area of the vertical gates
  const areaProps: AreaCompOpt =
    properties.orientation === "vertical"
      ? {
          shape: new k.Polygon([
            k.vec2(0, 0),
            k.vec2(20, 0),
            k.vec2(20, 64),
            k.vec2(0, 64),
          ]),
          offset: k.vec2(-18, -31),
        }
      : {}; // empty props, let the area be same size as sprite

  const gate = k.make([
    sprite,
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    k.area(areaProps),
    k.timer(),
    k.body({ isStatic: true }),
    {
      status,
      waitController: null,
      properties,
    },
    "gate",
    name,
  ]);

  gate.onCollide("player", (player: GameObj) => {
    const inventoryItem = getItemFromInventoryUI(player);
    const gateItem =
      ItemToHumanMap[
        generateCollectableCode({
          item: gate.properties.item,
          color: gate.properties.color,
        })
      ];
    const playerItem = ItemToHumanMap[generateCollectableCode(inventoryItem)];
    const dialogue = [
      `You need ${gateItem} to pass`,
      `and you have ${playerItem}.`,
    ];

    // We have a match so no need to show notice
    if (collectablesMatch(gate.properties, inventoryItem)) {
      return;
    }

    k.play("closedGate", { loop: false, volume: 1.0 });

    makeModal(k, dialogue, "talk");
  });

  gate.onCollideUpdate("player", async (player: GameObj) => {
    const inventoryItem = getItemFromInventoryUI(player);
    if (collectablesMatch(gate.properties, inventoryItem) === false) {
      return;
    }

    // If there is an existing timeout set to animate the gate closed
    // then cancel it as the gate is occupied by the player
    if (gate.waitController !== null) {
      gate.waitController.cancel();
      gate.waitController = null;
    }

    // The gate has been approached by the player and it is closed
    // so open it
    if (gate.status === "closed") {
      gate.status = "opening";
      gate.play("opening");
      k.play("openGate", { loop: false, volume: 1.0 });
    }
  });

  gate.onUpdate(() => {
    gateStatusHandler(gate);
  });

  gate.onBeforePhysicsResolve((collision) => {
    // The player is at the gate and the gate is open so turn off
    // collision detection to allow the player to pass through
    if (collision.target.is(["player"]) && gate.status === "open") {
      collision.preventResolution();
    }
  });

  return gate;
}

function gateStatusHandler(gate: GameObj) {
  // The gate is open and not scheduled to close, create a
  // close gate timer
  if (gate.status === "open" && gate.waitController === null) {
    setGateCloseTimer(gate, 1);
  }

  // The gate is opening and the opening animation has completed
  // so update the gate status to open
  if (gate.status === "opening" && gate.animFrame === 4) {
    gate.status = "open";
  }

  // The gate is closing and the closing animation has completed
  // so update the gate status to closed
  if (gate.status === "closing" && gate.animFrame === 4) {
    gate.status = "closed";
  }
}

function setGateCloseTimer(gate: GameObj, seconds: number) {
  gate.waitController = gate.wait(seconds, () => {
    if (gate.status === "open") {
      gate.status = "closing";
      gate.play("closing");
    }
  });
}
