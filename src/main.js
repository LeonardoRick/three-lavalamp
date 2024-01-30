import { Clock, Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three';

import './style.css';
import { minimalSetup, saveCameraCoordinates, loadCameraCoordinates } from '@leonardorick/three';
import colors from 'nice-color-palettes';
import { vertexShader, fragmentShader } from './glsl';
import { Pane } from 'tweakpane';
import { BindingApi } from '@tweakpane/core';

const pane = new Pane();
pane.title = 'Lavalamp Configuration';

/**
 * color pallete
 */
const favoriteIndexes = [10, 57, 83, 95];
const selectedPalleteIndex = favoriteIndexes[3];
// const selectedPalleteIndex = Math.floor(Math.random() * colors.length);
const uPallete = colors[selectedPalleteIndex].map((color) => new Color(color));

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
      uPallete: { value: uPallete },

      uInclineXY: { value: -0.8 },
      uInclineX: { value: 0.1 },
      uInclineOffset: { value: 0.25 },

      uNoise: { value: 0.3 },
      uColorSeed: { value: 10 },
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

pane.addBinding(uniforms.uColorSeed, 'value', {
  min: 0,
  max: 60,
  step: 0.5,
  label: 'color seed',
});

pane.addBinding(uniforms.uColorFlow, 'value', {
  min: -30,
  max: 30,
  step: 0.5,
  label: 'color flow',
});

pane.addBinding(uniforms.uColorSpeed, 'value', {
  min: 0,
  max: 60,
  step: 0.1,
  label: 'color change speed',
});

pane.addBinding(uniforms.uColorFreq, 'value', {
  min: 0,
  max: 20,
  step: 0.005,
  label: 'color messyness',
});

pane.addBinding(uniforms.uColorFreqY, 'value', {
  min: 0,
  max: 2,
  step: 0.001,
  label: 'color messyness Y',
});

pane.addBinding(uniforms.uNoiseFloor, 'value', {
  min: 0.1,
  max: 0.5,
  step: 0.001,
  label: 'Noise floor',
});

pane.addBinding(uniforms.uNoiseCeil, 'value', {
  min: 0.5,
  max: 1,
  step: 0.001,
  label: 'Noise ceil',
});

/**
 * color tweaks
 */
/**
 * @type {{value: Color[]}}
 */
const meshuPallete = mesh.material.uniforms.uPallete;
/**
 * @type {BindingApi[]}
 */
const selectedPalleteBindings = [];
let updatingPalleteSelectorFlag = false;
const colorsObj = {
  selected: selectedPalleteIndex,
  options: colors.length - 1,
};
const palleteSelector = pane.addBinding(colorsObj, 'selected', {
  options: colors.reduce((acum, _curr, currIndex) => {
    acum[`Pallete ${currIndex}`] = currIndex;
    return acum;
  }, {}),
});

const selectedPalleteObj = meshuPallete.value.reduce((acum, curr, index) => {
  acum[String(index)] = `#${curr.getHexString()}`;
  return acum;
}, {});

palleteSelector.on('change', ({ value }) => {
  updatingPalleteSelectorFlag = true;
  for (const [i, color] of colors[value].entries()) {
    const c = new Color(color);
    meshuPallete.value[i] = c;
    selectedPalleteObj[String(i)] = `#${c.getHexString()}`;
  }

  for (const bind of selectedPalleteBindings) bind.refresh();
  updatingPalleteSelectorFlag = false;
});

for (const i of Object.keys(selectedPalleteObj)) {
  const bind = pane.addBinding(selectedPalleteObj, i, {
    label: `color ${parseInt(i) + 1}`,
    view: 'color',
    color: { alpha: true },
  });
  selectedPalleteBindings.push(bind);
  bind.on('change', () => {
    if (!updatingPalleteSelectorFlag) {
      meshuPallete.value[i] = new Color(selectedPalleteObj[i]);
    }
  });
  bind.refresh();
}
window.Color = Color;
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
renderer.setClearColor(0x000000, 0); // the default;

/**
 * camera positioning
 */

// camera.rotation.x = 0.03241595243569971;
// camera.position.y = -0.05315775380063947;
// camera.position.x = -0.059067088047864084;
// camera.rotation.y = -0.035997638978877;
// camera.position.z = 1.6392895849398614;
// camera.rotation.z = 0.0011670540291655281;

const px = document.getElementById('position-x');
const py = document.getElementById('position-y');
const pz = document.getElementById('position-z');

const rx = document.getElementById('rotation-x');
const ry = document.getElementById('rotation-y');
const rz = document.getElementById('rotation-z');

// todo: if dev mode
if (true) {
  loadCameraCoordinates(camera);
  controls.addEventListener('change', (e) => {
    saveCameraCoordinates(camera);
    const coordinates = loadCameraCoordinates();
    px.innerHTML = coordinates.position.x;
    py.innerHTML = coordinates.position.y;
    pz.innerHTML = coordinates.position.z;

    rx.innerHTML = coordinates.rotation.x;
    ry.innerHTML = coordinates.rotation.y;
    rz.innerHTML = coordinates.rotation.z;
  });
}

/**
 * toggle camera coordinates visibiliity
 */
const resetCameracoordinates = pane.addButton({ title: 'reset camera coordinates' });
resetCameracoordinates.on('click', () => {
  controls.reset();
});

const table = document.querySelector('.camera-coordinates');
const cameraCoordObj = {
  show: {
    newLabel: 'hide',
    visibility: 'visible',
  },
  hide: {
    newLabel: 'show',
    visibility: 'hidden',
  },
};
const cameraCoordVisibilityBtn = pane.addButton({ title: 'show camera coordinates' });
cameraCoordVisibilityBtn.on('click', () => {
  const key = cameraCoordVisibilityBtn.title.split(' ')[0];
  cameraCoordVisibilityBtn.title = `${cameraCoordObj[key].newLabel} camera coordinates`;
  table.style.visibility = cameraCoordObj[key].visibility;
});

const copyCameraCoordBtn = document.querySelector('.camera-coordinates button');
copyCameraCoordBtn.addEventListener('click', () => {
  const coordinates = loadCameraCoordinates();
  navigator.clipboard.writeText(`
      coordinates.position.x: ${coordinates.position.x};
      coordinates.position.y: ${coordinates.position.y};
      coordinates.position.z: ${coordinates.position.z};
      coordinates.rotation.x: ${coordinates.rotation.x};
      coordinates.rotation.y: ${coordinates.rotation.y};
      coordinates.rotation.z: ${coordinates.rotation.z};
  `);
});

const copySettingsBtn = pane.addButton({ title: 'copy' });
copySettingsBtn.on('click', () => {
  navigator.clipboard.writeText(JSON.stringify(mesh.material.uniforms, null, 4));
});
/**
 * reset
 */
const initialUniforms = structuredClone(mesh.material.uniforms);
const resetBtn = pane.addButton({ title: 'reset' });
resetBtn.on('click', () => {
  for (const [key, value] of Object.entries(initialUniforms)) {
    // some bug when re-applying the cloned palete
    if (key !== 'uPallete') {
      mesh.material.uniforms[key].value = value.value;
    } else {
      mesh.material.uniforms.uPallete.value = uPallete;
    }
  }
});
