import { GameObj, KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { gameState } from "../state";

type AnimKey = "talk" | "happy";

export function makeModal(
  k: KAPLAYCtx,
  text: string | string[],
  anim: AnimKey,
  cb?: () => any,
) {
  gameState.setMode("modal");

  const modal = k.add([
    k.layer("ui"),
    k.opacity(),
    k.pos(k.getCamPos()),
    k.anchor("center"),
    {
      isRemoving: false,
    },
    "modal",
  ]);

  // Show level information
  modal.add([
    k.sprite("dialogBoxLarge"),
    k.scale(SCALE_FACTOR),
    k.pos(),
    k.anchor("center"),
  ]);

  modal.add([
    k.sprite("dialogCat", { anim }),
    k.scale(SCALE_FACTOR),
    k.pos(-240, 0),
    k.anchor("center"),
  ]);

  if (typeof text === "string") {
    modal.add([
      k.scale(SCALE_FACTOR),
      k.text(text, {
        font: "monogram",
        size: 14,
      }),
      k.pos(-165, -12),
      k.anchor("topleft"),
    ]);
  }

  if (typeof text === "object") {
    text.forEach((t, idx) => {
      modal.add([
        k.scale(SCALE_FACTOR),
        k.text(t, {
          font: "monogram",
          size: 14,
        }),
        k.pos(-165, -20 + idx * 20),
        k.anchor("topleft"),
      ]);
    });
  }

  k.onKeyPress(["up", "left", "down", "right", "space", "enter"], () => {
    if (gameState.getPaused() === false) return;
    if (modal?.isRemoving === true) return;

    removeModal(k, modal, cb);
  });
}

function removeModal(k: KAPLAYCtx, modal: GameObj, cb?: () => void) {
  modal.isRemoving = true;

  k.tween(
    modal.pos,
    k.vec2(modal.pos.x, modal.pos.y - k.height()),
    0.5,
    (value) => (modal.pos = value),
    k.easings.easeInSine,
  ).then(() => {
    modal.destroy();
    gameState.setMode("playing");
    if (cb) cb();
  });
}
