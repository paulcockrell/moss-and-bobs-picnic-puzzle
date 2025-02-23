import k from "./kaplayCtx";
import mainMenu from "./scenes/mainMenu";
import levelOne from "./scenes/levelOne";
import levelTwo from "./scenes/levelTwo";
import levelThree from "./scenes/levelThree";
import ending from "./scenes/ending";
import { gameState } from "./state";

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.setLayers(["game", "mask", "ui"], "game");

// Set background color
k.setBackground(k.Color.fromHex("#9bd4c3"));

// Load SFX
k.loadSound("music", "sfx/retro-game-arcade-236133.mp3");
k.loadSound("collect", "sfx/collect.mp3");
k.loadSound("closedGate", "sfx/closed-gate.mp3");
k.loadSound("openGate", "sfx/open-gate.mp3");
k.loadSound("dialogueTrigger", "sfx/dialogue-trigger.mp3");
k.loadSound("win", "sfx/win.mp3");

// Load sprites

k.loadSprite("Soil", "../maps/Soil_Ground_Tiles.png", {
  sliceX: 11,
  sliceY: 7,
});

k.loadSprite("Grass", "../maps/Grass_Tile_Layers.png", {
  sliceX: 11,
  sliceY: 7,
});

k.loadSprite("Dark grass", "../maps/Darker_Grass_Tile_Layers.png", {
  sliceX: 11,
  sliceY: 7,
});

k.loadSprite("Flowers", "../maps/Mushrooms_Flowers_Tiles.png", {
  sliceX: 12,
  sliceY: 5,
});

k.loadSprite("Bushes", "../maps/Bush_Tiles.png", {
  sliceX: 11,
  sliceY: 11,
});

k.loadSprite("Trees", "../maps/Trees_Stumps_Bushes.png", {
  sliceX: 12,
  sliceY: 7,
});

k.loadSprite("Fences", "../maps/Fences.png", {
  sliceX: 8,
  sliceY: 4,
});

k.loadSprite("Bridges", "../maps/Wooden_Bridge_v2.png", {
  sliceX: 4,
  sliceY: 3,
});

k.loadSprite("Water", "../maps/Water.png", {
  sliceX: 4,
  sliceY: 1,
});

k.loadSprite("Chickens", "../maps/Chicken_Baby.png", {
  sliceX: 8,
  sliceY: 19,
  anims: {
    stillRightA: { from: 0, to: 3, loop: true, speed: 0.7 },
    stillRightB: { from: 8, to: 14, loop: true, speed: 1.8 },
    stillRightC: { from: 64, to: 67, loop: true },
  },
});

k.loadSpriteAtlas("../maps/Fence_Gates.png", {
  gateHorizontal: {
    x: 0,
    y: 0,
    width: 320,
    height: 16,
    sliceX: 5,
    anims: {
      opening: { from: 0, to: 4, loop: false },
      closing: { from: 4, to: 0, loop: false },
      open: 4,
      closed: 0,
    },
  },
  gateVertical: {
    x: 0,
    y: 16,
    width: 160,
    height: 64,
    sliceX: 5,
    anims: {
      opening: { from: 0, to: 4, loop: false },
      closing: { from: 4, to: 0, loop: false },
      open: 4,
      closed: 0,
    },
  },
});

k.loadSprite("SignsNew", "../maps/SignsNew.png", {
  sliceX: 4,
  sliceY: 4,
});

k.loadSprite("SignsShapes", "../maps/SignsShapes.png", {
  sliceX: 4,
  sliceY: 4,
});

k.loadSprite("InventoryBlocks", "../maps/InventoryBlocks.png", {
  sliceX: 3,
  sliceY: 3,
  anims: {
    lightLarge: 7,
  },
});

k.loadSprite("ItemShadows", "../maps/ItemShadow.png", {
  sliceX: 1,
  sliceY: 1,
});

k.loadSprite("ItemsBasket", "../maps/Items.png", {
  sliceX: 8,
  sliceY: 15,
  anims: {
    a: 0,
    b: 8,
    c: 16,
    d: 24,
    e: 32,
    f: 40,
    g: 48,
    h: 56,
    i: 64,
    j: 72,
    k: 80,
    l: 88,
    m: 96,
    n: 104,
    o: 112,
  },
});

k.loadSprite("ItemsNew", "../maps/ItemsNew.png", {
  sliceX: 4,
  sliceY: 4,
  anims: {
    milkAny: 0,
    milkRed: 1,
    milkGreen: 2,
    milkBlue: 3,
    eggAny: 4,
    eggRed: 5,
    eggGreen: 6,
    eggBlue: 7,
    mushroomAny: 8,
    mushroomRed: 9,
    mushroomGreen: 10,
    mushroomBlue: 11,
    colorRed: 13,
    colorGreen: 14,
    colorBlue: 15,
  },
});

k.loadSprite("player", "../maps/Cat_Basic_Spritesheet.png", {
  sliceX: 4,
  sliceY: 4,
  anims: {
    stillDown: { from: 0, to: 1, loop: true },
    runDown: { from: 2, to: 3, loop: true },
    stillUp: { from: 4, to: 5, loop: true },
    runUp: { from: 6, to: 7, loop: true },
    stillLeft: { from: 8, to: 9, loop: true },
    runLeft: { from: 10, to: 11, loop: true },
    stillRight: { from: 12, to: 13, loop: true },
    runRight: { from: 14, to: 15, loop: true },
  },
});

k.loadSprite("dialogBoxLarge", "../maps/DialogBoxLarge.png");

k.loadSprite("dialogCat", "../maps/DialogCat.png", {
  sliceX: 5,
  sliceY: 15,
  anims: {
    talk: { from: 5, to: 6, loop: true, speed: 5 },
    happy: { from: 35, to: 36, loop: true, speed: 5 },
  },
});

k.loadSprite("playButtonsLarge", "../maps/PlayButtonsLarge.png", {
  sliceX: 2,
  sliceY: 2,
  anims: {
    buttonDepressed: 0,
    buttonPressed: 1,
  },
});

// Load scenes
k.scene("mainMenu", mainMenu);
k.scene("levelOne", levelOne);
k.scene("levelTwo", levelTwo);
k.scene("levelThree", levelThree);
k.scene("ending", ending);

// Start game!
const currentScene = gameState.getScene();
k.go(currentScene);
