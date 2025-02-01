import { KAPLAYCtx } from "kaplay";
import { SCALE_FACTOR } from "../contants";
import { gameState } from "../state";

type AnimKey = "talk" | "happy";

export interface ModalOpts {
  width: number;
  height: number;
}

export function makeModal(
  k: KAPLAYCtx,
  text: string,
  anim: AnimKey,
  opts: ModalOpts,
  cb?: () => any,
) {
  const mask = k.add([
    k.rect(opts.width, opts.height),
    k.color(k.Color.fromHex("#000000")),
    k.layer("mask"),
    k.opacity(0.3),
    "mask",
  ]);

  const levelDialog = k.add([
    "levelDialog",
    k.layer("ui"),
    k.opacity(),
    k.pos(opts.width / 2, opts.height / 2),
    k.anchor("center"),
  ]);

  // Show level information
  levelDialog.add([
    k.sprite("dialogBoxLarge"),
    k.scale(SCALE_FACTOR),
    k.pos(),
    k.anchor("center"),
  ]);

  levelDialog.add([
    k.sprite("dialogCat", { anim }),
    k.scale(SCALE_FACTOR),
    k.pos(-240, 0),
    k.anchor("center"),
  ]);

  levelDialog.add([
    k.scale(SCALE_FACTOR),
    k.text(text, {
      font: "monogram",
      size: 16,
    }),
    k.pos(30, 5),
    k.anchor("center"),
  ]);

  const playBtn = levelDialog.add([
    k.sprite("playButtonsLarge", { anim: "buttonDepressed" }),
    k.scale(SCALE_FACTOR),
    k.pos(210, 100),
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
      levelDialog.destroy();
      if (cb) cb();
    });

    k.tween(0.0, 0.3, 2, (value) => {
      mask.opacity = 0.3 - value;
    }).then(() => {
      mask.destroy();
    });
  });
}
