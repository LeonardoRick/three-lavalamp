import './style.css';
import {
  Clock,
  DoubleSide,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import { minimalSetup } from '@leonardorick/three';
import colors from 'nice-color-palettes';
import { vertexShader, fragmentShader } from './glsl';
import { setuPallete, setupTweakPane } from './setup-tewakpane';
import { setupCamera } from './setup-camera';

import * as I from '../types/typedefs';
import { normalize } from '@leonardorick/utils';

export const favoriteIndexes = [10, 57, 83, 95];
/**
 * color pallete
 */
addNewPalletes(colors);
// const palleteIndex = favoriteIndexes[3];
// const palleteIndex = Math.floor(Math.random() * colors.length);
const palleteIndex = 100;
const pallete = setuPallete(colors, palleteIndex);

/**
 * @param {I.IgetLavaLampOptions}
 * @returns {I.IgetLavaLampReturnType}
 */
export function getLavalamp({
  /**
   * options
   */
  canvasId = 'webgl',
  isDev = false,
  wireframe = false,
  addMeshOnScene = false,
  // antialias affects performance but gives a better rendering
  antialias = false,
  // powerPreference options: 'high-performance' | 'low-power' | 'default'
  powerPreference = 'default',
  // if the backgorund is transparent or not
  transparent = false,

  /**
   * uniforms
   */
  uTime = { value: 0 },
  uResolution = { value: new Vector2(0, 0) },
  uPixelRatio = { value: window.devicePixelRatio },
  uMousePosition = { value: new Vector2(0, 0) },

  uPallete = { value: pallete },
  uIntensity = { value: [1, 1, 1, 1, 1] },
  uImportance = { value: [1, 1, 1, 1, 1] },

  uInclineXY = { value: -0.8 },
  uInclineX = { value: 0.1 },
  uInclineOffset = { value: 0.3 },
  uBendOnX = { value: 3.9 },

  uNoiseHeight = { value: 2.3 },
  uNoiseX = { value: 5 },
  uNoiseY = { value: 6 },
  uNoiseSpeed = { value: 10 },
  uNoiseFloor = { value: 0 }, // cut the waves at the base

  uGrain = { value: 10 },
  uGrainSpeed = { value: 0.021 },
  uMouseBrightness = { value: 0.3 },
  uMousePerlin = { value: 0.9 },
  uMouseRadius = { value: 0.25 },
  uMainColor = { value: 0 }, // one of the 0-4 colors of the pallete
  uColorSeed = { value: 7 },
  uColorDirectionX = { value: 0.3 },
  uColorSpeed = { value: 0.3 },
  uColorFreq = { value: 0.3 },
  uColorFreqY = { value: 0.13 },
  uColorNoiseFloor = { value: 0 },
  uColorNoiseCeil = { value: 0.6 },

  uBrightness = { value: 1 },
  uPerlinNoise = { value: 0 },
} = {}) {
  /**
   * mesh
   */
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent,
    uniforms: {
      uTime,
      uResolution,
      uPixelRatio,
      uMousePosition,
      uPallete,
      uIntensity,
      uImportance,
      uInclineXY,
      uInclineX,
      uInclineOffset,
      uBendOnX,
      uNoiseHeight,
      uNoiseX,
      uNoiseY,
      uNoiseSpeed,
      uNoiseFloor,
      uGrain,
      uGrainSpeed,
      uMouseBrightness,
      uMousePerlin,
      uMouseRadius,
      uMainColor,
      uColorSeed,
      uColorDirectionX,
      uColorSpeed,
      uColorFreq,
      uColorFreqY,
      uColorNoiseFloor,
      uColorNoiseCeil,
      uBrightness,
      uPerlinNoise,
    },
    side: DoubleSide,
    wireframe,
  });
  const mesh = new Mesh(new PlaneGeometry(18, 10, 150, 150), material);

  /**
   * main scene
   */
  const clock = new Clock();
  const { uniforms } = mesh.material;
  const { renderer, scene, controls, camera, canvas, animationId } = minimalSetup({
    canvasId,
    addMeshOnScene,
    mesh,
    antialias,
    powerPreference,
    enableOrbitControl: isDev,
    animationCallback: () => {
      const elapsedTime = clock.getElapsedTime() * 0.003;
      uniforms.uTime.value = elapsedTime;
    },
    resizeCallback: ({ renderer }) => {
      uniforms.uResolution.value = getRendererSize(renderer);
      uniforms.uPixelRatio.value = getPixelRatio();
    },
  });
  /**
   * initial setup affect accessing renderer and canvas
   */
  renderer.setClearColor(0x000000, 0); // the default;
  uniforms.uResolution.value = getRendererSize(renderer);

  const mouseMoveHandler = (ev) => {
    uniforms.uMousePosition.value = getNormalizedMousePosition(ev, canvas);
  };
  canvas.addEventListener('mousemove', mouseMoveHandler);

  function getPixelRatio() {
    return renderer.getPixelRatio();
  }
  /**
   * get renderer size (x, y)
   * @param {WebGLRenderer} renderer
   * @returns {Vector2} renderer size
   */
  function getRendererSize(renderer) {
    return renderer.getSize(new Vector2());
  }

  if (isDev) {
    setupCamera(camera, controls, isDev);
    setupTweakPane(mesh, camera, controls, colors, palleteIndex);
  }

  function cleanup() {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener('mousemove', mouseMoveHandler);
    mesh.geometry.dispose();
    material.dispose();
    scene.clear();
    renderer.dispose();
  }

  return {
    scene,
    mesh,
    material,
    renderer,
    camera,
    cleanup,
  };
}

function addNewPalletes(palletes) {
  palletes.push(['#01eae5', '#0093dd', '#0a1656', '#06042d', '#00343d']);
}

function getNormalizedMousePosition(event, canvas) {
  return {
    x: normalize(event.clientX, canvas.clientWidth),
    y: normalize(event.clientY, canvas.clientHeight, { inverted: true }),
  };
}

export default getLavalamp;
