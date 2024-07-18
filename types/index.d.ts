import type { Color, Mesh, Scene, Vector2 } from 'three';

interface IgetLavaLampOptions {
  canvasId?: string;
  isDev?: boolean;
  wireframe?: boolean;
  addMeshOnScene?: boolean;

  uTime?: { value: number };
  uResolution?: { value: Vector2 };
  uMousePosition?: { value: Vector2 };

  uPallete?: { value: Color[] };
  uIntensity?: { value: number[] };
  uImportance?: { value: number[] };

  uInclineXY?: { value: number };
  uInclineX?: { value: number };
  uInclineOffset?: { value: number };
  uBendOnX?: { value: number };

  uNoiseHeight?: { value: number };
  uNoiseX?: { value: number };
  uNoiseY?: { value: number };
  uNoiseSpeed?: { value: number };
  uNoiseFloor?: { value: number };

  uGrain?: { value: number };
  uGrainSpeed?: { value: number };
  uMouseBrightness?: { value: number };
  uMousePerlin?: { value: number };
  uMouseRadius?: { value: number };
  uMainColor?: { value: number };
  uColorSeed?: { value: number };
  uColorDirectionX?: { value: number };
  uColorSpeed?: { value: number };
  uColorFreq?: { value: number };
  uColorFreqY?: { value: number };
  uColorNoiseFloor?: { value: number };
  uColorNoiseCeil?: { value: number };

  uPerlinNoise?: { value: boolean };
}

interface IgetLavaLampReturnType {
  mesh: Mesh;
  scene: Scene;
}

export function getLavalamp(options?: IgetLavaLampOptions): IgetLavaLampReturnType;
