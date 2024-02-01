import './style.css';
import { Clock, Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { minimalSetup } from '@leonardorick/three';
import colors from 'nice-color-palettes';
import { vertexShader, fragmentShader } from './glsl';
import { setupTweakPane } from './setup-tewakpane';
import { setupCamera } from './setup-camera';

import * as I from '../types/typedefs';
/**
 * @param {I.IgetLavaLampOptions}
 * @returns {I.IgetLavaLampReturnType}
 */
export function getLavalamp({ isDev = false } = {}) {
  /**
   * color pallete
   */
  const favoriteIndexes = [10, 57, 83, 95];
  const palleteIndex = favoriteIndexes[3];
  // const palleteIndex = Math.floor(Math.random() * colors.length);
  const uPallete = colors[palleteIndex].map((color) => new Color(color));

  /**
   * mesh
   */
  const mesh = new Mesh(
    new PlaneGeometry(16, 10, 150, 150),
    new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPallete: { value: uPallete },
        uIntensity: { value: [1, 1, 1, 1, 1] },

        uInclineXY: { value: -0.8 },
        uInclineX: { value: 0.1 },
        uInclineOffset: { value: 0.25 },
        uBendOnX: { value: 18.9 },

        uNoise: { value: 2.77 },
        uColorSeed: { value: 9 },
        uColorFlow: { value: 0.3 },
        uColorSpeed: { value: 0.3 },
        uColorFreq: { value: 0.3 },
        uColorFreqY: { value: 0.13 },

        uNoiseFloor: { value: 0.1 },
        uNoiseCeil: { value: 0.6 },
      },
      side: DoubleSide,
      // wireframe: true,
    })
  );

  /**
   * main scene
   */
  const clock = new Clock();
  const animationCallback = () => {
    const elapsedTime = clock.getElapsedTime() * 0.003;
    mesh.material.uniforms.uTime.value = elapsedTime;
  };

  const { renderer, scene, controls, camera } = minimalSetup({
    enableOrbitControl: isDev,
    mesh,
    animationCallback,
  });
  renderer.setClearColor(0x000000, 0); // the default;

  if (isDev) {
    setupCamera(camera, controls, isDev);
    setupTweakPane(mesh, camera, controls, colors, palleteIndex);
  }
  return {
    scene,
    mesh,
  };
}

export default getLavalamp;
