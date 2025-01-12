import kaplay from "kaplay";
import { displayDialogue, makeBackground, setCamScale } from "./utils";
import { SCALE_FACTOR } from "./contants";

const k = kaplay({
  global: false,
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.loadSprite("spritesheet", "./tilemap_packed.png", {
  sliceX: 16,
  sliceY: 16,
  anims: {
    "idle-down": 114,
    "walk-down": { from: 114, to: 114, loop: true, speed: 8 },
    "idle-side": 114,
    "walk-side": { from: 114, to: 114, loop: true, speed: 8 },
    "idle-up": 114,
    "walk-up": { from: 114, to: 114, loop: true, speed: 8 },
  },
});

k.setBackground(k.Color.fromHex("#311047"));

k.scene("start", async (): Promise<void> => {
  makeBackground(k);

  const mapData = await (await fetch("./level1.json")).json();
  const layers = mapData.layers;

  const map = k.add([k.sprite("spritesheet"), k.pos(0), k.scale(SCALE_FACTOR)]);

  const player = k.make([
    k.sprite("spritesheet", { anim: "walk-down" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(SCALE_FACTOR),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue(
              "Hello, I'm some dialogue!",
              () => (player.isInDialogue = false),
            );
          });
        }
      }

      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * SCALE_FACTOR,
            (map.pos.y + entity.y) * SCALE_FACTOR,
          );
          k.add(player);
          continue;
        }
      }
    }
  }

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
  });
});

k.go("start");
