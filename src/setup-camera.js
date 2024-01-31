import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  saveCameraCoordinates,
  loadCameraCoordinates,
  getCameraCoordinates,
} from '@leonardorick/three';
/**
 *
 * @param {Camera} camera
 * @param {OrbitControls} controls
 */
export function setupCamera(camera, controls) {
  /**
   * camera positioning
   */

  // camera.rotation.x = 0.03241595243569971;
  // camera.position.y = -0.05315775380063947;
  // camera.position.x = -0.059067088047864084;
  // camera.rotation.y = -0.035997638978877;
  // camera.position.z = 1.6392895849398614;
  // camera.rotation.z = 0.0011670540291655281;

  createCameraConteiner();
  const px = document.getElementById('position-x');
  const py = document.getElementById('position-y');
  const pz = document.getElementById('position-z');

  const rx = document.getElementById('rotation-x');
  const ry = document.getElementById('rotation-y');
  const rz = document.getElementById('rotation-z');
  loadCameraCoordinates(camera);

  controls.addEventListener('change', () => {
    saveCameraCoordinates(camera);
    const coordinates = getCameraCoordinates();
    px.innerHTML = coordinates.position.x;
    py.innerHTML = coordinates.position.y;
    pz.innerHTML = coordinates.position.z;

    rx.innerHTML = coordinates.rotation.x;
    ry.innerHTML = coordinates.rotation.y;
    rz.innerHTML = coordinates.rotation.z;
  });
}

function createCameraConteiner() {
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
      height: 325px;
      width: 350px;
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
    .tw-pane.tp-rotv {
      font-size: 14px;
      padding: 4px;
    }

    .tw-pane .tp-lblv {
      padding: 4px 0;
    }
  `;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.append(style);
}
