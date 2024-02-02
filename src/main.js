import './style.css';
import { Clock, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { minimalSetup } from '@leonardorick/three';
import colors from 'nice-color-palettes';
import { vertexShader, fragmentShader } from './glsl';
import { setuPallete, setupTweakPane } from './setup-tewakpane';
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
  colors.push(['#01eae5', '#0093dd', '#0a1656', '#06042d', '#00343d']);

  const favoriteIndexes = [10, 57, 83, 95];
  const palleteIndex = favoriteIndexes[3];
  // const palleteIndex = Math.floor(Math.random() * colors.length);
  // const palleteIndex = 100;
  const uPallete = setuPallete(colors, palleteIndex);
  /**
   * mesh
   */
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPallete: { value: uPallete },
      uIntensity: { value: [1, 1, 1, 1, 1] },
      uImportance: { value: [1, 1, 1, 1, 1] },

      uInclineXY: { value: -0.8 },
      uInclineX: { value: 0.1 },
      uInclineOffset: { value: 0.3 },
      uBendOnX: { value: 3.9 },

      uNoiseHeight: { value: 2.3 },
      uNoiseX: { value: 5 },
      uNoiseY: { value: 6 },
      uNoiseSpeed: { value: 10 },
      uNoiseFloor: { value: 0 }, // cut the waves at the base

      uGrain: { value: 20 },
      uGrainSpeed: { value: 0.021 },

      uMainColor: { value: 0 }, // one of the 0-4 colors of the pallete
      uColorSeed: { value: 7 },
      uColorDirectionX: { value: 0.3 },
      uColorSpeed: { value: 0.3 },
      uColorFreq: { value: 0.3 },
      uColorFreqY: { value: 0.13 },
      uColorNoiseFloor: { value: 0 },
      uColorNoiseCeil: { value: 0.6 },
    },
    side: DoubleSide,
    // wireframe: true,
  });
  const mesh = new Mesh(new PlaneGeometry(18, 10, 150, 150), material);

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
