import kaplay from "kaplay";

const k = kaplay({
  global: false,
  touchToMouse: true,
  font: "fonts/monogram",
  canvas: document.getElementById("game"),
  crisp: true,
  debug: false, // set to false once ready for production
});

export default k;
