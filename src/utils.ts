import { KAPLAYCtx } from "kaplay";

export function makeBackground(k: KAPLAYCtx) {
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex("#36A6E0"))]);
}

export function computeRank(score: number) {
  switch (true) {
    case score > 30:
      return "S";
    case score > 20:
      return "A";
    case score > 10:
      return "B";
    case score > 2:
      return "C";
    default:
      return "D";
  }
}

export function goToGame(k: KAPLAYCtx) {
  k.play("confirm");
  k.go("main");
}

export function setCamScale(k: KAPLAYCtx) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.setCamScale(k.vec2(1));
  } else {
    k.setCamScale(k.vec2(1.5));
  }
}

export function displayDialogue(text: string, onDisplayEnd: () => void) {
  const dialogueUI = document.getElementById("textbox-container");
  const dialogue = document.getElementById("dialogue");

  dialogueUI.style.display = "block";
  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialogue.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 1);

  const closeBtn = document.getElementById("close");

  function onCloseBtnClick() {
    onDisplayEnd();
    dialogueUI.style.display = "none";
    dialogue.innerHTML = "";
    clearInterval(intervalRef);
    closeBtn.removeEventListener("click", onCloseBtnClick);
  }

  closeBtn.addEventListener("click", onCloseBtnClick);

  addEventListener("keypress", (key) => {
    if (key.code === "Enter") {
      closeBtn.click();
    }
  });
}
