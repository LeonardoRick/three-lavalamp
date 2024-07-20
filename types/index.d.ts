import type { Camera, Color, Mesh, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';

interface IgetLavaLampOptions {
  canvasId?: string;
  isDev?: boolean;
  wireframe?: boolean;
  addMeshOnScene?: boolean;
  // antialias affects performance but gives a better rendering
  antialias: boolean;
  // powerPreference options: 'high-performance' | 'low-power' | 'default'
  powerPreference: 'high-performance' | 'low-power' | 'default';
  // if the backgorund is transparent or not
  transparent: boolean;
  /**
   * uniforms
   */
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
  material: ShaderMaterial;
  renderer: WebGLRenderer;
  camera: Camera;
  cleanup: () => void;
}

export function getLavalamp(options?: IgetLavaLampOptions): IgetLavaLampReturnType;
