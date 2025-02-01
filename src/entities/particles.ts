import { KAPLAYCtx, Vec2 } from "kaplay";

export function emitParticles(k: KAPLAYCtx, pos: Vec2) {
  k.loadSprite("StarFull", "../maps/StarFull.png").then((sprite) => {
    const starSpriteData = k.getSprite("StarFull").data;

    let particleEmitter = k.add([
      k.pos(pos),
      k.particles(
        {
          max: 10, // the max amount of particles generated from this emitter at one time
          lifeTime: [1, 2], // how long the particles last before being destroyed
          speed: [100, 50], // how fast the particles are moving
          acceleration: [k.vec2(0), k.vec2(0, -5)], // changes the speed of the particle over its lifetime
          damping: [0, 1], // slows down the particle over its lifetime
          opacities: [1.0, 0.0], // the opacity of the particle over its lifetime
          texture: starSpriteData.tex, // texture of the sprite
          quads: starSpriteData.frames, // to tell whe emitter what frames of the sprite to use
        },
        {
          lifetime: 2, // how long the emitter should last
          rate: 5, // the rate at which particles are emitted
          direction: 0, // the direction where particles should be traveling
          spread: 360, //45, // variance in the direction where particles should be traveling
        },
      ),
    ]);

    // .onEnd is called when the emitter's lifetime (in this example 5 seconds), has expired.
    particleEmitter.onEnd(() => {
      k.destroy(particleEmitter);
    });

    // Emit Particles at runtime
    particleEmitter.emit(10);
  });
}
