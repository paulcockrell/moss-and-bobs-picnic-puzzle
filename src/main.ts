import kaplay, { Collision, GameObj, Vec2 } from "kaplay";
import * as tiled from "@kayahr/tiled";
import mapData from "../maps/level1.map.json";
import { compArray, displayDialogue, drawTiles, setCamScale } from "./utils";
import { SCALE_FACTOR } from "./contants";
import { makePlayer } from "./entities/player";
import { makeGuard } from "./entities/guard";
import { CollectableProps, makeCollectable } from "./entities/collectable";
import { makePortal } from "./entities/portal";

const k = kaplay({
  global: false,
  touchToMouse: true,
  font: "monogram",
  // @ts-expect-error issue with HTMLElement?
  canvas: document.getElementById("game"),
  debug: true, // set to false once ready for production
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.loadSprite("spritesheet", "../maps/tilemap_packed.png", {
  sliceX: 12,
  sliceY: 11,
  anims: {
    player: 112,
    guard: 96,
    greypotion: 113,
    greenpotion: 114,
    redpotion: 115,
    bluepotion: 116,
    hammer: 117,
    axe: 118,
    halfaxe: 119,
    sword: 104,
    staff: 130,
  },
});

k.setBackground(k.Color.fromHex("#000000"));

export interface Entities {
  player: GameObj;
  guards: GameObj[];
  collectables: GameObj[];
  portals: GameObj[];
}

k.scene("start", async (): Promise<void> => {
  const map = k.add([k.pos(0, 0)]);

  const entities: Entities = {
    player: null,
    guards: [],
    collectables: [],
    portals: [],
  };

  mapData.layers.forEach((layer) => {
    // Tiles
    if (tiled.isTileLayer(layer)) {
      drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

    // Objects
    if (tiled.isObjectGroup(layer)) {
      if (layer.name === "Boundaries") {
        layer.objects.forEach((boundary) => {
          map.add([
            k.area({
              shape: new k.Rect(
                k.vec2(0),
                boundary.width * SCALE_FACTOR,
                boundary.height * SCALE_FACTOR,
              ),
            }),
            k.body({ isStatic: true }),
            k.pos(boundary.x * SCALE_FACTOR, boundary.y * SCALE_FACTOR),
            "boundary",
          ]);
        });
      }

      if (layer.name === "SpawnPoints") {
        layer.objects.forEach((spawnPoint) => {
          if (spawnPoint.type === "player") {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );
            const player = makePlayer(k, pos);
            entities.player = player;
            k.add(player);
          }

          if (spawnPoint.type === "guard") {
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );

            const dialogueProp = spawnPoint.properties?.find(
              (prop) => prop.name === "dialogue" && prop.type === "string",
            );

            const dialogue = dialogueProp
              ? (dialogueProp.value as string)
              : "Halt";

            const guard = makeGuard(k, pos, dialogue);
            k.add(guard);
          }

          if (spawnPoint.type === "collectable") {
            const props = spawnPoint.properties.reduce(
              (a, b) => ({ ...a, [b.name]: b.value }),
              {},
            ) as CollectableProps;
            const pos = k.vec2(
              (map.pos.x + spawnPoint.x) * SCALE_FACTOR,
              (map.pos.y + spawnPoint.y) * SCALE_FACTOR,
            );
            const collectable = makeCollectable(k, pos, spawnPoint.name, props);
            k.add(collectable);
          }
        });
      }

      if (layer.name === "Portals") {
        layer.objects.forEach((portal) => {
          const newPortal = makePortal(k, portal);
          map.add(newPortal);
        });
      }
    }
  });

  entities.player.onCollideUpdate("portal", async (portal: GameObj) => {
    // If the user is not walking 'into' the portal then skip teleport
    // Portal doors are only on the vertical plane
    if (["left", "right"].includes(entities.player.direction)) {
      return;
    }

    // Check if the player holds the correct items in his inventory
    // to pass through the portal
    const inventory = k.get("inventory")[0];
    const collectables = inventory.get("collectable");
    const requiredKeys = portal.properties.reduce(
      (a: string[], b: { name: string; type: string; value: string }) => [
        ...a,
        b.value,
      ],
      [],
    );
    const keys = collectables.reduce((a, collectable) => {
      const props = collectable.properties;
      return [...a, props.type, props.variant];
    }, []);
    const unlocked = compArray<string>(requiredKeys, keys);

    if (!unlocked) {
      return;
    }

    // hit bottom of portal, move player to top of portal
    if (
      entities.player.pos.y >= portal.pos.y + portal.area.shape.height / 2 &&
      entities.player.direction === "up"
    ) {
      entities.player.pos.y = portal.pos.y - 16;
      return;
    }

    // hit top of portal, move player to bottom of portal
    if (
      entities.player.pos.y <= portal.pos.y + portal.area.shape.height / 2 &&
      entities.player.direction === "down"
    ) {
      entities.player.pos.y = portal.pos.y + portal.area.shape.height + 16;
      return;
    }
  });

  entities.player.onCollide("guard", async (guard: GameObj) => {
    entities.player.isInDialogue = true;
    displayDialogue(guard.dialogue, () => {
      entities.player.isInDialogue = false;
    });
  });

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.setCamPos(
      entities.player.worldPos().x,
      entities.player.worldPos().y - 100,
    );
  });
});

k.go("start");
