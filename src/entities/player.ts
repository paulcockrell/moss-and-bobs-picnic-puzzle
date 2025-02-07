import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { areAnyOfTheseKeysDown } from "../utils";
import { addInventoryUI } from "./inventory";
import { gameState } from "../state";

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
    k.z(15),
    k.timer(),
    {
      inventoryUI: null,
      speed: 100,
      direction: "stillDown",
      isInDialogue: false,
    },
    "player",
  ]);

  player.onUpdate(() => {
    if (gameState.getMode() === "won" && player.direction !== "stillDown") {
      player.play("stillDown");
      player.direction = "stillDown";

      return;
    }

    // When the player is 'in dialogue' (there is a modal on screen)
    // ensure they stand still and are not continuing their movement
    // animation.
    if (gameState.getShowModal()) {
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

      return;
    }
  });

  addInventoryUI(k, player, "eggGreen");
  setPlayerControls(k, player);

  return player;
}

function setPlayerControls(k: KAPLAYCtx, player: GameObj) {
  k.onKeyDown("left", () => {
    if (gameState.getShowModal() === true) return;
    if (areAnyOfTheseKeysDown(k, ["up", "down"])) return;

    if (player.direction !== "left") {
      player.play("runLeft");
      player.direction = "left";
    }

    player.move(-player.speed, 0);
  });

  k.onKeyDown("right", () => {
    if (gameState.getShowModal() === true) return;
    if (areAnyOfTheseKeysDown(k, ["up", "down"])) return;

    if (player.direction !== "right") {
      player.play("runRight");
      player.direction = "right";
    }

    player.move(player.speed, 0);
  });

  k.onKeyDown("up", () => {
    if (gameState.getShowModal() === true) return;
    if (areAnyOfTheseKeysDown(k, ["left", "right"])) return;

    if (player.direction !== "up") {
      player.play("runUp");
      player.direction = "up";
    }

    player.move(0, -player.speed);
  });

  k.onKeyDown("down", () => {
    if (gameState.getShowModal() === true) return;
    if (areAnyOfTheseKeysDown(k, ["left", "right"])) return;

    if (player.direction !== "down") {
      player.play("runDown");
      player.direction = "down";
    }

    player.move(0, player.speed);
  });

  k.onKeyRelease(() => {
    if (gameState.getShowModal() === true) return;

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
