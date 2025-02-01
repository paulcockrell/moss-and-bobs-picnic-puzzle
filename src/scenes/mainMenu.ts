import k from "../kaplayCtx";
import { gameState } from "../state";

export default function mainMenu() {
  k.add([
    k.text("Press Space to play Magic Farm Maze", {
      font: "monogram",
      size: 48,
    }),
    k.pos(k.center().x, k.center().y - 200),
    k.anchor("center"),
  ]);

  k.onKeyPress("space", () => {
    const nextScene = gameState.setScene("sceneOne");
    k.go(nextScene);
  });
}
