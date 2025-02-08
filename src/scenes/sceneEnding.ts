import k from "../kaplayCtx";
import { gameState } from "../state";

export default function sceneEnding() {
  k.add([
    k.text("You have completed Moss' Mad Mutating Maze. Well done!", {
      font: "monogram",
      size: 48,
    }),
    k.pos(k.center().x, k.center().y - 200),
    k.anchor("center"),
  ]);

  k.onKeyPress("space", () => {
    const nextScene = gameState.setScene("mainMenu");
    k.go(nextScene);
  });
}
