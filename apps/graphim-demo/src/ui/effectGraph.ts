import {
  DefaultInput,
  Filter,
  Primitives,
  UniformSetter,
  Vector2,
} from 'graphim';
import type { EffectId } from '../logic/effects';

/**
 * Build a Graphim filter graph for the selected demo effect.
 * Returns the leaf node to pass to `Renderer.render` / `animate`.
 */
export function buildEffectGraph(effectId: EffectId): Filter {
  const input = new DefaultInput();
  const leaf = createLeaf(effectId);
  leaf.connect(input);
  return leaf;
}

function createLeaf(effectId: EffectId): Filter {
  switch (effectId) {
    case 'gray':
      return new Primitives.Gray();
    case 'sepia':
      return new Primitives.Sepia();
    case 'neg':
      return new Primitives.Neg();
    case 'blur':
      return new Primitives.Blur(8);
    case 'bloom':
      return new Primitives.Bloom(0.45, 2.5, 1.2);
    case 'pixel':
      return new Primitives.Pixel(12);
    case 'frosted':
      return new Primitives.FrostedGlass(4);
    case 'wave':
      return new Filter(
        `
uniform vec2 delta;
void main(void) {
  gl_FragColor = texture2D(
    renderTexture,
    vUv + sin(time) * distance(vUv, vec2(0.5, 0.5)) * delta
  );
}
`,
        new UniformSetter({ delta: new Vector2(0.08, 0.12) }),
      );
    default: {
      const _exhaustive: never = effectId;
      return _exhaustive;
    }
  }
}
