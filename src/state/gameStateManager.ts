type Scene = "mainMenu" | "levelOne" | "ending";
type Mode = "intro" | "playing" | "won" | "lost";

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
    let showingModal = false;

    return {
      setScene: (value: Scene) => (scene = value),
      getScene: (): Scene => scene,
      setMode: (value: Mode) => (mode = value),
      getMode: (): Mode => mode,
      setMapDimensions: (value: MapDims) => (mapDimensions = value),
      getMapDimensions: (): MapDims => mapDimensions,
      setShowModal: (value: boolean) => (showingModal = value),
      getShowModal: (): boolean => showingModal,
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
