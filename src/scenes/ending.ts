import k from "../kaplayCtx";
import { gameState } from "../state";
import { SCALE_FACTOR } from "../contants";

export default function ending() {
  k.setBackground(k.Color.fromHex("#9bd4c3"));

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Moss and Bobs", {
      font: "arcadeclassic",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y - 65),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Picnic Puzzle", {
      font: "arcadeclassic",
      size: 25,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos()),
    k.anchor("center"),
  ]);

  k.add([
    k.text("You have completed all 3 levels. Well done!", {
      font: "monogram",
      size: 48,
    }),
    k.pos(k.center().x, k.center().y + 80),
    k.anchor("center"),
  ]);

  k.add([
    k.scale(SCALE_FACTOR),
    k.text("Press SPACE to return", {
      font: "monogram",
      size: 20,
    }),
    k.color(k.Color.fromHex("#FFFFFF")),
    k.pos(k.getCamPos().x, k.getCamPos().y + 150),
    k.anchor("center"),
  ]);

  k.onKeyPress("space", () => {
    const nextScene = gameState.setScene("mainMenu");
    k.go(nextScene);
  });
}
