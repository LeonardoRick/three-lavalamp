import { loadCameraCoordinates, loadControlsPosition } from '@leonardorick/three';
import { Color, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';
import { BindingApi, IntColor } from '@tweakpane/core';
import {
  setupNiceInitialCameraPosition,
  updateCameraAndControlsOnLocalStorageAndHTML,
} from './setup-camera';
import { isDefined, keyboardUndoListener } from '@leonardorick/utils';

// this labels are globaly refenced because they are values
// used to identify the bind later on the code

const SELECTED_PALLETE_LABEL = 'selected pallete';
const COLOR_LABEL = 'color';

/**
 * @typedef {Object} ISelectedPaletteObj
 * @property {[key: number]: {
 *    color: string,
 *    intensity: number,
 *    importance: number
 *  }}
 */
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
    paneTag.style.width = '380px';
  }
  setupUniformTweaks(mesh, pane);
  const { colorsObj, selectedPalleteObj } = setupColors(mesh, pane, colors, palleteIndex);

  setupCopySettings(mesh, pane);
  setupToggleCameraCoordinatesVisibility(pane, camera, controls);

  setupReset(mesh, pane, colors, palleteIndex, colorsObj, selectedPalleteObj);
  setupUndoListener(pane);
}

/**
 * setup unform tweaks
 * @param {Mesh} mesh
 * @param {Pane} pane
 */
function setupUniformTweaks(mesh, pane) {
  const { uniforms } = mesh.material;
  const basics = pane.addFolder({
    title: 'basics',
  });

  basics.addBinding(uniforms.uInclineXY, 'value', {
    min: -5,
    max: 5,
    step: 0.1,
    label: 'incline Y',
  });

  basics.addBinding(uniforms.uInclineX, 'value', {
    min: -1,
    max: 1,
    step: 0.1,
    label: 'incline X',
  });

  basics.addBinding(uniforms.uInclineOffset, 'value', {
    min: -20,
    max: 20,
    step: 0.1,
    label: 'twist',
  });

  basics.addBinding(uniforms.uBendOnX, 'value', {
    min: -20,
    max: 20,
    step: 0.1,
    label: 'bend on X',
  });

  /**
   * floor messyness (noise)
   */
  basics.addBinding(uniforms.uNoiseHeight, 'value', {
    min: -5,
    max: 10,
    step: 0.05,
    label: 'noise height',
  });

  basics.addBinding(uniforms.uNoiseX, 'value', {
    min: 0,
    max: 20,
    step: 0.5,
    label: 'noise X',
  });

  basics.addBinding(uniforms.uNoiseY, 'value', {
    min: 0,
    max: 20,
    step: 0.5,
    label: 'noise Y',
  });

  basics.addBinding(uniforms.uNoiseSpeed, 'value', {
    min: 0,
    max: 500,
    step: 1,
    label: 'noise speed',
  });

  basics.addBinding(uniforms.uNoiseFloor, 'value', {
    min: -1,
    max: 0,
    step: 0.01,
    label: 'noise floor',
  });

  const grain = pane.addFolder({ title: 'grain' });

  grain.addBinding(uniforms.uGrain, 'value', {
    min: 0,
    max: 40,
    step: 0.5,
    label: 'grain',
  });

  grain.addBinding(uniforms.uGrainSpeed, 'value', {
    min: 0.00001,
    max: 1,
    step: 0.0001,
    label: 'grain speed',
  });

  const mouse = pane.addFolder({ title: 'mouse' });
  mouse.addBinding(uniforms.uMouseBrightness, 'value', {
    min: -3,
    max: 3,
    step: 0.1,
    label: 'mouse effect brightness',
  });

  mouse.addBinding(uniforms.uMousePerlin, 'value', {
    min: -3,
    max: 3,
    step: 0.1,
    label: 'mouse effect perlin',
  });

  mouse.addBinding(uniforms.uMouseRadius, 'value', {
    min: 0,
    max: 1,
    step: 0.05,
    label: 'mouse effect radius',
  });

  const color = pane.addFolder({ title: 'color' });

  color.addBinding(uniforms.uColorSeed, 'value', {
    min: 0,
    max: 60,
    step: 0.5,
    label: 'color seed',
  });

  color.addBinding(uniforms.uColorDirectionX, 'value', {
    min: -100,
    max: 100,
    step: 0.1,
    label: 'color direction X',
  });

  color.addBinding(uniforms.uColorSpeed, 'value', {
    min: 0,
    max: 60,
    step: 0.1,
    label: 'color change speed',
  });

  color.addBinding(uniforms.uColorFreq, 'value', {
    min: 0,
    max: 20,
    step: 0.005,
    label: 'color messyness',
  });

  color.addBinding(uniforms.uColorFreqY, 'value', {
    min: 0,
    max: 2,
    step: 0.001,
    label: 'color messyness Y',
  });

  color.addBinding(uniforms.uColorNoiseFloor, 'value', {
    min: 0.01,
    max: 0.5,
    step: 0.001,
    label: 'color noise floor',
  });

  color.addBinding(uniforms.uColorNoiseCeil, 'value', {
    min: 0.5,
    max: 1,
    step: 0.001,
    label: 'color noise ceil',
  });

  const collorEffects = pane.addFolder({ title: 'color effects' });
  collorEffects.addBinding(uniforms.uPerlinNoise, 'value', {
    min: 0,
    max: 10,
    step: 0.1,
    label: 'perlin',
  });
}
/**
 * setup pallete selector
 * @param {Mesh} mesh
 * @param {Pane} pane
 * @param {string[]} colors
 * @param {number} palleteIndex
 * @returns {{
 * colorsObj:
 *    {selected: number,
 *     options: string[]
 *    },
 * selectedPalleteObj: {
 *   [key: number]: {
 *     color: string,
 *     intensity: number,
 *     importance: number
 *   }
 * }
 * }}
 */
function setupColors(mesh, pane, colors, palleteIndex) {
  const pallete = pane.addFolder({ title: 'pallete' });
  /**
   * @type {{uPallete: {value: Color[]}, uIntensity: {value: number[]}, uImportance: {value: number[]}}}
   */
  const { uPallete, uIntensity, uImportance } = mesh.material.uniforms;

  /**
   * @type {BindingApi[]}
   */
  const selectedPalleteBindings = [];
  let updatingPalleteSelectorFlag = false;
  const colorsObj = {
    selected: palleteIndex,
    options: colors.length - 1,
  };

  /**
   * create pallete selector that will update all colors inside
   * selectedPalleteObj[i].color everytime we change the selection
   */
  const palleteSelector = pallete.addBinding(colorsObj, 'selected', {
    label: SELECTED_PALLETE_LABEL,
    options: colors.reduce((acum, _curr, currIndex) => {
      acum[`Pallete ${currIndex}`] = currIndex;
      return acum;
    }, {}),
  });

  pallete.addBinding(mesh.material.uniforms.uMainColor, 'value', {
    label: 'main color',
    options: [0, 1, 2, 3, 4].reduce((acum, curr) => {
      acum[String(curr + 1)] = curr;
      return acum;
    }, {}),
  });

  /**
   *   this object holds a reference of each color and it's selected intensity as
   * {
   *   '0': {
   *    color: #123421,
   *    intensity: 1,
   *    importance: 1
   *   }
   * }
   */
  const selectedPalleteObj = uPallete.value.reduce((acum, curr, index) => {
    const i = String(index);
    acum[i] = {
      color: `#${curr.getHexString()}`,
      intensity: uIntensity.value[index],
      importance: uImportance.value[index],
    };
    return acum;
  }, {});

  /**
   * everytime the dropdown changes we need to 1) go over the uPallete uniform from
   * the mesh material and udpate update each color and 2) update selectedPalleteObj
   * to reflect the new colors on the tweak pane
   */
  palleteSelector.on('change', ({ value }) => {
    updatingPalleteSelectorFlag = true;
    for (const [i, color] of colors[value].entries()) {
      const c = new Color(color);
      uPallete.value[i] = c;
      selectedPalleteObj[String(i)].color = `#${c.getHexString()}`;
    }

    for (const bind of selectedPalleteBindings) bind.refresh();
    updatingPalleteSelectorFlag = false;
  });

  /**
   * create the color pickers for each one of the 5 colors of
   * the pallete and update the mesh uPallete specific color by it's
   * index on every color change
   */
  for (const si of Object.keys(selectedPalleteObj)) {
    const i = parseInt(si);
    const bind = pallete.addBinding(selectedPalleteObj[si], 'color', {
      label: `${COLOR_LABEL} ${i + 1}`,
      view: 'color',
      color: { alpha: true },
    });
    selectedPalleteBindings.push(bind);
    bind.on('change', () => {
      if (!updatingPalleteSelectorFlag) {
        uPallete.value[i] = new Color(selectedPalleteObj[i].color);
      }
    });

    /**
     * intensity bind so we can explode each color
     */
    pallete
      .addBinding(selectedPalleteObj[si], 'intensity', {
        label: `color ${i + 1} intensity`,
        step: 0.1,
        min: 0,
        max: 10,
      })
      .on('change', (e) => {
        uIntensity.value[i] = e.value;
      });

    /**
     * importance bind so the color is more present than the others
     */
    pallete
      .addBinding(selectedPalleteObj[i], 'importance', {
        label: `color ${i + 1} importance`,
        step: 0.05,
        min: 0.1,
        max: 5,
      })
      .on('change', (e) => {
        uImportance.value[i] = e.value;
      });
  }
  return {
    colorsObj,
    selectedPalleteObj,
  };
}

/**
 * setup copy settings
 * @param {Mesh} mesh
 * @param {Pane} pane
 */
function setupCopySettings(mesh, pane) {
  const copySettingsBtn = pane.addButton({ title: 'copy' });
  copySettingsBtn.on('click', () => {
    const config = JSON.stringify(mesh.material.uniforms, null, 4);
    const text = config
      .replace(/"uPallete": {(value|[\s":0-9,\[\]])*}/g, 'uPallete: {value: uPallete}')
      .replace(
        /"uMousePosition": {(value|[.\s":{0-9xy,])*}\s*}/g,
        'uMousePosition: { value: new Vector2(0, 0) }'
      )
      .replace(
        /"uResolution": {(value|[.\s":{0-9xy,])*}\s*}/g,
        'uResolution: { value: new Vector2(0, 0) }'
      );
    navigator.clipboard.writeText(text);
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
 * @param {{selected: number, options: string[]}} colorsObj
 * @param {{[key: number]: {
 *    color: string,
 *    intensity: number,
 *    importance: number
 *  }}} selectedPalleteObj
 */
function setupReset(mesh, pane, colors, palleteIndex, colorsObj, selectedPalleteObj) {
  // some how using structuredClone or even parsing directly are kepping references of the
  // original object here when reseting (?????). So to bypass that we save only the string reference
  // and parse it everytime we click at the button to ensure we have the first uniforms
  const initialUniformsString = JSON.stringify(mesh.material.uniforms);
  const resetBtn = pane.addButton({ title: 'reset' });
  resetBtn.on('click', () => {
    const initialUniforms = JSON.parse(initialUniformsString);

    initialUniforms.uPallete.value = setuPallete(colors, palleteIndex);
    /**
     * reset uniform bindings
     */
    for (const [key, value] of Object.entries(initialUniforms)) {
      // some bug when re-applying the cloned palete
      mesh.material.uniforms[key].value = value.value;
    }

    /**
     * reset pallete selector.
     */
    colorsObj.selected = palleteIndex;

    /**
     * reset specific colors, intensity and importance.
     * After structuredClone, the THREE.Color type becomes a simple POJO with the important values to retrieve the Color class, so we need to convert
     * it back to a Color instance so we can call getHexString()
     * @type {{uPallete: {value: {r: number, g: number, b: number, isColor: true}}, uIntensity: {value: number[]}, uImportance: {value: number[]}}}
     */
    const { uPallete, uIntensity, uImportance } = initialUniforms;
    for (const [si, color] of Object.entries(selectedPalleteObj)) {
      const i = parseInt(si);

      // even updating the pallete entirely we need to update the color
      // here because sometimes the pallete didn't change but the colors did
      color.color = `#${new Color(uPallete.value[i]).getHexString()}`;
      color.intensity = uIntensity.value[i];
      color.importance = uImportance.value[i];
    }

    pane.refresh();
  });
}

/**
 * return a THREE.Color list based on a string colors list
 * @param {string[]} colors
 * @param {number} palleteIndex
 * @returns {Color[]}
 */
export function setuPallete(colors, palleteIndex) {
  return colors[palleteIndex].map((color) => new Color(color)).slice();
}

/**
 * setup undo listner to undo up to 10 moves
 * @param {Pane} pane
 */
function setupUndoListener(pane) {
  let lastEvents = [];
  let undoFlag = false;

  const oldValueMap = new WeakMap();
  setupOriginValue(pane.children);
  setupKeyboardListener();
  setupPaneChangeListener();

  function setupKeyboardListener() {
    keyboardUndoListener(() => {
      undoFlag = true;

      if (lastEvents.length) {
        const { event, oldValue } = lastEvents.pop();
        if (event) {
          /**
           * @type {BindingApi}
           */
          const target = event.target;
          target.controller.value.setRawValue(oldValue);
          /**
           * Removes 5 colors from queue after updating pallete
           * if event a pallete change we need to remove from the list the last
           * five events that changed the colors on the color pickers themselves.
           */
          if (event.target.label === SELECTED_PALLETE_LABEL) {
            let counter = 0;
            lastEvents = lastEvents.filter((item) => {
              const isColor = item.event.target.label.match(new RegExp(`${COLOR_LABEL} [1-5]`));
              if (isColor) {
                counter++;
              }
              return !isColor || counter > 5;
            });
          }

          // another approach of programatically writing
          // // const { writer_, target: bindingTarget } = target.controller.value.binding;
          // // writer_(bindingTarget, value);
          pane.refresh();
        }
      }

      undoFlag = false;
    });
  }

  function setupPaneChangeListener() {
    pane.on('change', (e) => {
      /**
       * @type {BindingApi}
       */
      const target = e.target;

      if (e.last) {
        const inputBindingValue = target.controller.value;
        const meta = oldValueMap.get(inputBindingValue);
        // update old value even on "undo events" so we have the right
        // value after pressing ctrl + z multiple times for the same binding
        oldValueMap.set(inputBindingValue, inputBindingValue.rawValue);
        const oldValue = meta ? meta : inputBindingValue.originValue;
        if (!undoFlag && isDefined(oldValue) && inputBindingValue.rawValue !== oldValue) {
          lastEvents.push({ event: e, oldValue });
          // we can go back up to 50 times
          if (lastEvents.length > 50) {
            lastEvents.shift();
          }
        }
      }
    });
  }

  /**
   * we need the origin value stored because tweakpanel don't save this value and then we can't access it
   * on the panel.change event. For further values we handle inside the panel.change event but the first
   * one we need to save a reference to retrieve later when rawValue is already overwritten
   * @param {any[]} pane
   */
  function setupOriginValue(pane) {
    for (const bind of pane) {
      if (bind.children) {
        setupOriginValue(bind.children);
      }
      const { value } = bind.controller;
      if (isDefined(value?.rawValue)) {
        const { rawValue } = value;
        if (isIntColor(rawValue)) {
          value.originValue = new IntColor(structuredClone(rawValue));
        } else {
          value.originValue = rawValue;
        }
      }
    }

    /**
     * somehow instanceof IntColor doesnt work because it's a _IntColor instance!!
     * @param {any} value
     */
    function isIntColor(value) {
      return value instanceof IntColor || (value._comps?.length && value.mode && value.type);
    }
  }
}
