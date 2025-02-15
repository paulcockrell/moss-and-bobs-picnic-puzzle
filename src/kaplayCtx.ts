import kaplay from "kaplay";

const k = kaplay({
  global: false,
  touchToMouse: true,
  font: "fonts/monogram",
  canvas: document.getElementById("game"),
  debug: true, // set to false once ready for production
});

export default k;
