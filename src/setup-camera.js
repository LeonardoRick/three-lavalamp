import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  saveCameraCoordinates,
  loadCameraCoordinates,
  getCameraCoordinates,
  loadControlsPosition,
  saveControlsPosition,
  getControlsPosition,
} from '@leonardorick/three';
/**
 *
 * @param {Camera} camera
 * @param {OrbitControls | undefined} controls
 */
export function setupCamera(camera, controls) {
  createHTMLCameraConteiner();
  setupNiceInitialCameraPosition(camera, controls);
  loadCameraCoordinates(camera);

  if (controls) {
    loadControlsPosition(controls);
  }

  controls.addEventListener('change', () => {
    updateCameraAndControlsOnLocalStorageAndHTML(camera, controls);
  });
}

/**
 * @param {Camera} camera
 * @param {OrbitControls | undefined} controls
 */
export function updateCameraAndControlsOnLocalStorageAndHTML(camera, controls) {
  /**
   * camera
   */
  saveCameraCoordinates(camera);

  const px = document.getElementById('position-x');
  const py = document.getElementById('position-y');
  const pz = document.getElementById('position-z');

  const rx = document.getElementById('rotation-x');
  const ry = document.getElementById('rotation-y');
  const rz = document.getElementById('rotation-z');

  const coordinates = getCameraCoordinates();

  px.innerHTML = coordinates.position.x;
  py.innerHTML = coordinates.position.y;
  pz.innerHTML = coordinates.position.z;

  rx.innerHTML = coordinates.rotation.x;
  ry.innerHTML = coordinates.rotation.y;
  rz.innerHTML = coordinates.rotation.z;

  /**
   * controls
   */
  if (controls) {
    saveControlsPosition(controls);

    const controlsPosition = getControlsPosition();
    const cpx = document.getElementById('controls-position-x');
    const cpy = document.getElementById('controls-position-y');
    const cpz = document.getElementById('controls-position-z');
    cpx.innerHTML = controlsPosition.x;
    cpy.innerHTML = controlsPosition.y;
    cpz.innerHTML = controlsPosition.z;
  }
}

/**
 * setup nice initial camera position
 * @param {Camera} camera
 * @param {OrbitControls | undefined} controls
 */
export function setupNiceInitialCameraPosition(camera, controls) {
  const { position, rotation } = getCameraCoordinates();
  if (!position && !rotation) {
    camera.position.x = -0.022564259301999078;
    camera.position.y = -3.5549455126039;
    camera.position.z = 3.231396343006788;
    camera.rotation.x = 0.8330386098103777;
    camera.rotation.y = -0.00469682226978494;
    camera.rotation.z = 0.005167034772869913;

    controls.target.x = -2.782424331791637e-31;
    controls.target.y = -6.90188201111906e-30;
    controls.target.z = 4.695345105357163e-46;
  }

  if (controls) {
    controls.target.x = -2.782424331791637e-31;
    controls.target.y = -6.90188201111906e-30;
    controls.target.z = 4.695345105357163e-46;
  }
}

function createHTMLCameraConteiner() {
  addStyles();

  const coords = ['x', 'y', 'z'];
  const props = ['position', 'rotation'];

  const cameraCoordinates = document.createElement('div');
  cameraCoordinates.classList.add('camera-coordinates');
  cameraCoordinates.style.visibility = 'hidden';

  const h2 = document.createElement('h2');
  h2.innerHTML = 'Camera coordinates';
  cameraCoordinates.appendChild(h2);

  const table = document.createElement('table');
  for (const [i, prop] of props.entries()) {
    for (const coord of coords) {
      const tr = document.createElement('tr');
      const tdLabel = document.createElement('td');
      tdLabel.innerHTML = `${prop} ${coord}: `;
      const tdValue = document.createElement('td');
      tdValue.id = `${prop}-${coord}`;
      tdValue.innerHTML = '{{value}}';
      tr.appendChild(tdLabel);
      tr.appendChild(tdValue);
      table.appendChild(tr);
    }
    if (i === 0) {
      const separator = document.createElement('tr');
      separator.classList.add('separator');
      table.appendChild(separator);
    }
  }

  const separator = document.createElement('tr');
  separator.classList.add('separator');
  table.appendChild(separator);
  /**
   * controls
   */
  for (const coord of coords) {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.innerHTML = `controls position ${coord}: `;
    const tdValue = document.createElement('td');
    tdValue.id = `controls-position-${coord}`;
    tdValue.innerHTML = '{{value}}';
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    table.appendChild(tr);
  }
  /**
   * putting all together
   */
  cameraCoordinates.appendChild(table);

  const button = document.createElement('button');
  button.innerHTML = 'copy';
  cameraCoordinates.appendChild(button);

  document.body.appendChild(cameraCoordinates);
}

function addStyles() {
  const css = /* css */ `
    .camera-coordinates {
      position: absolute;
      top: 8px;
      height: 425px;
      width: 425px;
      padding: 6px;

      font-family: var(
        --tp-base-font-family,
        Roboto Mono,
        Source Code Pro,
        Menlo,
        Courier,
        monospace
      );
      /* same as tweakpane */
      color: var(--darkreader-text--tp-container-foreground-color, #c0bab2);
      background-color: var(--darkreader-bg--tp-base-background-color, #202324);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .camera-coordinates h2 {
      background-color: var(--darkreader-bg--tp-container-background-color, rgba(60, 65, 67, 0.1));
      padding: 4px;
      margin: 0 0 6px;
      border-top-left-radius: 6px;
      text-align: center;
      border-top-right-radius: 6px;
      font-size: 16px;
    }

    .camera-coordinates table {
      flex: 1;
    }

    .camera-coordinates table tr {
      margin-bottom: 12px;
      display: block;
      text-align: left;
    }

    .camera-coordinates .separator {
      height: 6px;
      width: 310px;
      display: block;
      margin: 8px 0;
      background-color: var(--darkreader-bg--tp-button-background-color, #43494c);
    }

    .camera-coordinates button {
      width: 100%;
      cursor: pointer;
      background-color: var(--darkreader-text--tp-container-foreground-color, #c0bab2);
      color: var(--btn-fg, #28292e);
      font-family: var(
        --tp-base-font-family,
        Roboto Mono,
        Source Code Pro,
        Menlo,
        Courier,
        monospace
      );
      font-weight: bold;
      margin-bottom: 8px;
    }

    /* change panel styles of tweakpane */
    .tw-pane-lavalamp.tp-rotv {
      font-size: 12px;
      padding: 2px;
    }

    .tw-pane-lavalamp .tp-txtv-num {
      width: 61px;
    }

    .tw-pane-lavalamp .tp-sldtxtv_s {
      padding: 0 1px;
    }

    .tw-pane-lavalamp .tp-lblv_l {
      padding-right: 8px;
    }
  `;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.append(style);
}
