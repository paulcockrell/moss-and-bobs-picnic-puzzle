import { KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { gameState } from "../state";

type AnimKey = "talk" | "happy";

export function makeModal(k: KAPLAYCtx, text: string, anim: AnimKey) {
  const mask = k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#000000")),
    k.layer("mask"),
    k.opacity(0.3),
    "mask",
  ]);

  const levelDialog = k.add([
    "levelDialog",
    k.layer("ui"),
    k.pos(0, 0),
    k.opacity(),
  ]);

  // Show level information
  levelDialog.add([
    k.sprite("dialogBoxLarge"),
    k.scale(SCALE_FACTOR),
    k.pos(k.center().x - 270, k.center().y - 150),
    k.anchor("center"),
  ]);

  levelDialog.add([
    k.sprite("dialogCat", { anim }),
    k.scale(SCALE_FACTOR),
    k.pos(k.center().x - 510, k.center().y - 150),
    k.anchor("center"),
  ]);

  levelDialog.add([
    k.scale(SCALE_FACTOR),
    k.text(text, {
      font: "monogram",
      size: 16,
    }),
    k.pos(k.center().x - 245, k.center().y - 145),
    k.anchor("center"),
  ]);

  const playBtn = levelDialog.add([
    k.sprite("playButtonsLarge", { anim: "buttonDepressed" }),
    k.scale(SCALE_FACTOR),
    k.pos(k.center().x - 61, k.center().y - 50),
    k.area({ cursor: "pointer" }),
    k.anchor("center"),
    {
      setControls() {},
    },
  ]);

  playBtn.onMousePress(() => {
    playBtn.play("buttonPressed");
  });

  playBtn.onMouseRelease(() => {
    playBtn.play("buttonDepressed");

    k.tween(
      levelDialog.pos,
      k.vec2(levelDialog.pos.x, levelDialog.pos.y - k.height()),
      2,
      (value) => (levelDialog.pos = value),
      k.easings.easeInSine,
    ).then(() => {
      gameState.setPaused(false);
      levelDialog.destroy();
    });

    k.tween(0.0, 0.3, 2, (value) => {
      mask.opacity = 0.3 - value;
    }).then(() => {
      mask.destroy();
    });
  });
}
