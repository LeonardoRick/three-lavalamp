import { getLavalamp } from '../../main.js';
import lr from '../../assets/models/lr.glb';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader';
import { LoopSubdivision } from 'three-subdivide';
import { SRGBColorSpace, ACESFilmicToneMapping, PCFShadowMap, Camera } from 'three';

function example2() {
  const { material, scene, renderer, camera } = getLavalamp({
    isDev: true,
    wireframe: false,
    addMeshOnScene: false,
    antialias: true,
    transparent: true,

    uInclineXY: { value: 0 },
    uInclineX: { value: 0 },
    uInclineOffset: { value: 0 },
    uBendOnX: { value: 0 },
    uNoiseHeight: { value: 0 },

    uGrain: { value: 5 },

    uMouseBrightness: { value: 0.5 },

    uColorSpeed: { value: 3.5 },
  });

  setupCamera(camera);

  // renderer
  // less bright, more realistic
  renderer.physicallyCorrectLights = true;
  // unsquize the color that was compressed on the linear encoding, giving a more realistic look
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping; // mais bonitinho

  // depends on direcitonalLight.castShadow = true
  // and our materials receiving shadows
  // and  our materials casting shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMappingExposure = 0.8;

  const gltfLoader = new GLTFLoader();
  const iterations = 1;
  const params = {
    split: true, // optional, default: true
    uvSmooth: true, // optional, default: false
    preserveEdges: true, // optional, default: false
    flatOnly: true, // optional, default: false
    maxTriangles: Infinity, // optional, default: Infinity
  };

  gltfLoader.load(lr, (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry = LoopSubdivision.modify(child.geometry, iterations, params);
        child.material = material;
      }
    });

    scene.add(gltf.scene);
  });
}

/**
 * setup initial caemra position
 * @param {Camera} camera
 */
function setupCamera(camera) {
  camera.position.x = 2.8138520348608047e-8;
  camera.position.y = 3.577085184074775;
  camera.position.z = 0.000003577133512832005;
  camera.rotation.x = -1.5707953267813857;
  camera.rotation.y = 7.866326604856477e-9;
  camera.rotation.z = 0.007866058085196352;
}

example2();
