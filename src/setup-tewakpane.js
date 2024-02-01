import { loadCameraCoordinates, loadControlsPosition } from '@leonardorick/three';
import { BindingApi } from '@tweakpane/core';
import { Color, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';
import {
  setupNiceInitialCameraPosition,
  updateCameraAndControlsOnLocalStorageAndHTML,
} from './setup-camera';

/**
 *
 * @param {Mesh} mesh
 * @param {Camera} camera
 * @param {OrbitControls | undefined} controls
 * @param {string[]} colors
 * @param {number} palleteIndex
 */
export function setupTweakPane(mesh, camera, controls, colors, palleteIndex) {
  const pane = new Pane();
  pane.title = 'Lavalamp Configuration';

  pane.element.classList.add('tw-pane'); // used to style on style.css
  const paneTag = document.querySelector('.tp-dfwv');
  if (paneTag) {
    paneTag.style.width = '350px';
  }
  setupUniformTweaks(mesh, pane);
  setupColors(mesh, pane, colors, palleteIndex);

  setupCopySettings(mesh, pane);
  setupToggleCameraCoordinatesVisibility(pane, camera, controls);
  setupReset(mesh, pane, colors, palleteIndex);
}

/**
 * setup unform tweaks
 * @param {Mesh} mesh
 * @param {Pane} pane
 */
function setupUniformTweaks(mesh, pane) {
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

  pane.addBinding(uniforms.uBendOnX, 'value', {
    min: -20,
    max: 20,
    step: 0.1,
    label: 'bend on X',
  });

  pane.addBinding(uniforms.uNoise, 'value', {
    min: -5,
    max: 5,
    step: 0.01,
    label: 'noise',
  });

  pane.addBinding(uniforms.uMainColor, 'value', {
    label: 'main color',
    options: [0, 1, 2, 3, 4].reduce((acum, curr) => {
      acum[String(curr + 1)] = curr;
      return acum;
    }, {}),
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
    label: 'color noise floor',
  });

  pane.addBinding(uniforms.uNoiseCeil, 'value', {
    min: 0.5,
    max: 1,
    step: 0.001,
    label: 'color noise ceil',
  });
}
/**
 * setup pallete selector
 * @param {Mesh} mesh
 * @param {Pane} pane
 * @param {string[]} colors
 * @param {number} palleteIndex
 */
function setupColors(mesh, pane, colors, palleteIndex) {
  /**
   * @type {{value: Color[]}}
   */
  const meshuPallete = mesh.material.uniforms.uPallete;
  const meshuIntensity = mesh.material.uniforms.uIntensity;
  /**
   * @type {BindingApi[]}
   */
  const selectedPalleteBindings = [];
  let updatingPalleteSelectorFlag = false;
  const colorsObj = {
    selected: palleteIndex,
    options: colors.length - 1,
  };
  // create pallete selector that will update all colors inside
  // selectedPalleteObj[i].color everytime we change the selection
  const palleteSelector = pane.addBinding(colorsObj, 'selected', {
    options: colors.reduce((acum, _curr, currIndex) => {
      acum[`Pallete ${currIndex}`] = currIndex;
      return acum;
    }, {}),
  });

  // this object holds a reference of each color and it's selected intensity as
  // {
  //   '0': {
  //     color: #123421,
  //     intensity: 1
  //   }
  // }
  const selectedPalleteObj = meshuPallete.value.reduce((acum, curr, index) => {
    const i = String(index);
    acum[i] = {
      color: `#${curr.getHexString()}`,
      intensity: meshuIntensity.value[index],
    };
    return acum;
  }, {});

  // everytime the dropdown changes we need to 1) go over the uPallete uniform from
  // the mesh material and udpate update each color and 2) update selectedPalleteObj
  // to reflect the new colors on the tweak panel
  palleteSelector.on('change', ({ value }) => {
    updatingPalleteSelectorFlag = true;
    for (const [i, color] of colors[value].entries()) {
      const c = new Color(color);
      meshuPallete.value[i] = c;
      selectedPalleteObj[String(i)].color = `#${c.getHexString()}`;
    }

    for (const bind of selectedPalleteBindings) bind.refresh();
    updatingPalleteSelectorFlag = false;
  });

  // here we create the color pickers for each one of the 5 colors of
  // the pallete and update the mesh uPallete specific color by it's
  // index on every color change
  for (const i of Object.keys(selectedPalleteObj)) {
    const bind = pane.addBinding(selectedPalleteObj[i], 'color', {
      label: `color ${parseInt(i) + 1}`,
      view: 'color',
      color: { alpha: true },
    });
    selectedPalleteBindings.push(bind);
    bind.on('change', () => {
      if (!updatingPalleteSelectorFlag) {
        meshuPallete.value[i] = new Color(selectedPalleteObj[i].color);
      }
    });

    // intensity bind so we can explode each color
    const intensityBind = pane.addBinding(selectedPalleteObj[i], 'intensity', {
      label: `color ${parseInt(i) + 1} intensity`,
      step: 0.1,
      min: 0,
      max: 10,
    });
    intensityBind.on('change', (e) => {
      meshuIntensity.value[i] = e.value;
    });
  }
}

/**
 * setup copy settings
 * @param {Mesh} mesh
 * @param {Pane} pane
 */
function setupCopySettings(mesh, pane) {
  const copySettingsBtn = pane.addButton({ title: 'copy' });
  copySettingsBtn.on('click', () => {
    navigator.clipboard.writeText(JSON.stringify(mesh.material.uniforms, null, 4));
  });
}
/**
 * toggle camera coordinates visibiliity
 * @param {Pane} pane
 * @param {Camera} camera
 * @param {OrbitControls | undefined} controls
 */
function setupToggleCameraCoordinatesVisibility(pane, camera, controls) {
  const resetCameracoordinates = pane.addButton({ title: 'reset camera coordinates' });
  resetCameracoordinates.on('click', () => {
    controls?.reset();
    setupNiceInitialCameraPosition(camera);
    updateCameraAndControlsOnLocalStorageAndHTML(camera, controls);
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
    const controlsPosition = loadControlsPosition();
    navigator.clipboard.writeText(`
            camera.position.x = ${coordinates.position.x};
            camera.position.y = ${coordinates.position.y};
            camera.position.z = ${coordinates.position.z};
            camera.rotation.x = ${coordinates.rotation.x};
            camera.rotation.y = ${coordinates.rotation.y};
            camera.rotation.z = ${coordinates.rotation.z};

            controls.target.x = ${controlsPosition.x};
            controls.target.y = ${controlsPosition.y};
            controls.target.z = ${controlsPosition.z};
        `);
  });
}
/**
 * reset configurations to beginning
 * @param {Mesh} mesh
 * @param {Pane} pane
 * @param {string[]} colors
 * @param {palleteIndex} index
 */
function setupReset(mesh, pane, colors, palleteIndex) {
  const initialUniforms = structuredClone(mesh.material.uniforms);
  const resetBtn = pane.addButton({ title: 'reset' });
  resetBtn.on('click', () => {
    for (const [key, value] of Object.entries(initialUniforms)) {
      // some bug when re-applying the cloned palete
      if (key !== 'uPallete') {
        mesh.material.uniforms[key].value = value.value;
      } else {
        mesh.material.uniforms.uPallete.value = setuPallete(colors, palleteIndex);
      }
    }
  });
}

function setuPallete(colors, palleteIndex) {
  return colors[palleteIndex].map((color) => new Color(color));
}
