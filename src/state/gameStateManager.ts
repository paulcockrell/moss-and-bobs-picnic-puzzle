type Scene = "mainMenu" | "sceneOne";
type Mode = "playing" | "won" | "lost";

export default function gameStateManager() {
  let instance = null;

  function createInstance() {
    let scene: Scene = "mainMenu";
    let paused = true;
    let mode: Mode = "playing";

    return {
      setScene: (value: Scene) => (scene = value),
      getScene: (): Scene => scene,
      setPaused: (value: boolean) => (paused = value),
      getPaused: (): boolean => paused,
      setMode: (value: Mode) => (mode = value),
      getMode: (): Mode => mode,
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
