type Scene = "mainMenu" | "sceneOne";
type Mode = "intro" | "playing" | "modal" | "won" | "lost";

export interface MapDims {
  width: number;
  height: number;
}

export default function gameStateManager() {
  let instance = null;

  function createInstance() {
    let scene: Scene = "mainMenu";
    let mode: Mode = "intro";
    let mapDimensions: MapDims = { width: 0, height: 0 };

    return {
      setScene: (value: Scene) => (scene = value),
      getScene: (): Scene => scene,
      getPaused: (): boolean => mode !== "playing",
      setMode: (value: Mode) => (mode = value),
      getMode: (): Mode => mode,
      setMapDimensions: (value: MapDims) => (mapDimensions = value),
      getMapDimensions: (): MapDims => mapDimensions,
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
}
