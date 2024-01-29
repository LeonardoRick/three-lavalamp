import { Clock, Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three';

import './style.css';
import { minimalSetup, saveCameraCoordinates, loadCameraCoordinates } from '@leonardorick/three';
import colors from 'nice-color-palettes';
import { vertexShader, fragmentShader } from './glsl';
import { Pane } from 'tweakpane';

const pane = new Pane();
console.log(pane);
pane.title = 'Lavalamp Backgorund';

/**
 * color pallete
 */
// const ind = Math.floor(Math.random() * colors.length);
const favoriteIndexes = [10, 57, 83, 95];
const ind = favoriteIndexes[3];
const pallete = colors[ind].map((color) => new Color(color));
// const pallete = colors[1].map((color) => new Color(color));
console.log(ind);

/**
 * mesh
 */
const mesh = new Mesh(
  new PlaneGeometry(4, 4, 150, 150),
  new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPallete: { value: pallete },

      uInclineXY: { value: -0.8 },
      uInclineX: { value: 0.1 },
      uInclineOffset: { value: 0.25 },

      uNoise: { value: 0.3 },
    },
    side: DoubleSide,
    // wireframe: true,
  })
);

/**
 * shader material tweaks
 */
const { uniforms } = mesh.material;
pane.addBinding(uniforms.uInclineXY, 'value', {
  min: -5,
  max: 5,
  step: 0.1,
  label: 'incline Y',
});

pane.addBinding(uniforms.uInclineX, 'value', {
  min: -1,
  max: 1,
  step: 0.1,
  label: 'incline X',
});

pane.addBinding(uniforms.uInclineOffset, 'value', {
  min: -20,
  max: 20,
  step: 0.1,
  label: 'twist',
});

pane.addBinding(uniforms.uNoise, 'value', {
  min: -5,
  max: 5,
  step: 0.01,
  label: 'noise',
});

/**
 * animation
 */
const clock = new Clock();
const animationCallback = () => {
  const elapsedTime = clock.getElapsedTime() * 0.003;
  mesh.material.uniforms.uTime.value = elapsedTime;
};

const { renderer, controls, camera } = minimalSetup({
  enableOrbitControl: true,
  mesh,
  animationCallback,
});
renderer.setClearColor('lightblue');

/**
 * camera positioning
 */
camera.rotation.x = 0.03241595243569971;
camera.position.y = -0.05315775380063947;
camera.position.x = -0.059067088047864084;
camera.rotation.y = -0.035997638978877;
camera.position.z = 1.6392895849398614;
camera.rotation.z = 0.0011670540291655281;

// todo: if dev mode
if (true) {
  loadCameraCoordinates(camera);
  controls.addEventListener('change', (e) => {
    saveCameraCoordinates(camera);
  });
}
