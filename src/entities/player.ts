import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { areAnyOfTheseKeysDown } from "../utils";

export function makePlayer(k: KAPLAYCtx, pos: Vec2) {
  const player = k.make([
    k.sprite("player", { anim: "stillDown" }),
    k.area({
      shape: new k.Rect(k.vec2(0), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(pos),
    k.scale(SCALE_FACTOR),
    k.z(10),
    {
      speed: 100,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  setPlayerControls(k, player);
  addInventory(k);

  return player;
}

function addInventory(k: KAPLAYCtx) {
  k.add([k.pos(20, 10), k.fixed(), "inventory"]);
}

function setPlayerControls(k: KAPLAYCtx, player: GameObj) {
  k.onKeyDown("left", () => {
    if (player.isInDialogue) return;
    if (areAnyOfTheseKeysDown(k, ["up", "down"])) return;
    if (player.direction !== "left") {
      player.play("runLeft");
      player.direction = "left";
    }

    player.move(-player.speed, 0);
  });

  k.onKeyDown("right", () => {
    if (player.isInDialogue) return;
    if (areAnyOfTheseKeysDown(k, ["up", "down"])) return;
    if (player.direction !== "right") {
      player.play("runRight");
      player.direction = "right";
    }

    player.move(player.speed, 0);
  });

  k.onKeyDown("up", () => {
    if (player.isInDialogue) return;
    if (areAnyOfTheseKeysDown(k, ["left", "right"])) return;
    if (player.direction !== "up") {
      player.play("runUp");
      player.direction = "up";
    }

    player.move(0, -player.speed);
  });

  k.onKeyDown("down", () => {
    if (player.isInDialogue) return;
    if (areAnyOfTheseKeysDown(k, ["left", "right"])) return;
    if (player.direction !== "down") {
      player.play("runDown");
      player.direction = "down";
    }

    player.move(0, player.speed);
  });

  k.onKeyRelease(() => {
    switch (player.direction) {
      case "left":
        player.play("stillLeft");
        player.direction = "stillLeft";
        break;
      case "right":
        player.play("stillRight");
        player.direction = "stillRight";
        break;
      case "up":
        player.play("stillUp");
        player.direction = "stillUp";
        break;
      case "down":
        player.play("stillDown");
        player.direction = "stillDown";
        break;
    }
  });
}
