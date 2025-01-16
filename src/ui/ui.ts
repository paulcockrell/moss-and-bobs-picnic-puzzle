import { KAPLAYCtx } from "kaplay";

// Take a look at this inventory system for hints! https://editor.p5js.org/MartiansParlor/sketches/VQqmhbLWK
export const addUI = (k: KAPLAYCtx) => {
  const ui = k.make([
    k.text("Inventory"),
    k.fixed(),
    k.pos(12, 12),
    {
      setEvents() {
        this.on("update", () => {
          const inventory = k.get("inventory");
          //console.log(inventory.get("*"));
        });
      },
    },
  ]);

  ui.onUpdate(() => {
    const inventory = k.get("inventory")[0];
    if (!inventory) return;

    const items = inventory
      .get("*")
      .map((item) => item.type)
      .join(", ");

    ui.text = `Inventory: ${items}`;
  });

  k.add(ui);
};
