import { Camera, Color, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';

/**
 * @typedef IgetLavaLampOptions
 * @property {string} canvasId
 * @property {boolean} isDev
 * @property {boolean} wireframe
 * @property {boolean} addMeshOnScene
 * antialias affects performance but gives a better rendering
 * @property {boolean} antialias,
 * powerPreference options: 'high-performance' | 'low-power' | 'default'
 * @property {'high-performance' | 'low-power' | 'default'} powerPreference
 * if the backgorund is transparent or not
 * @property {boolean} transparent,
 *
 * uniforms:
 * @property {{value: number}} uTime
 * @property {{value: Vector2}} uResolution
 * @property {{value: Vector2}} uMousePosition
 *
 * @property {{value: Color[]}} uPallete
 * @property {{value: number[]}} uIntensity
 * @property {{value: number[]}} uImportance
 *
 * @property {{value: number}} uInclineXY
 * @property {{value: number}} uInclineX
 * @property {{value: number}} uInclineOffset
 * @property {{value: number}} uBendOnX
 *
 * @property {{value: number}} uNoiseHeight
 * @property {{value: number}} uNoiseX
 * @property {{value: number}} uNoiseY
 * @property {{value: number}} uNoiseSpeed
 * @property {{value: number}} uNoiseFloor
 *
 * @property {{value: number}} uGrain
 * @property {{value: number}} uGrainSpeed
 * @property {{value: number}} uMouseBrightness
 * @property {{value: number}} uMousePerlin
 * @property {{value: number}} uMouseRadius
 * @property {{value: number}} uMainColor
 * @property {{value: number}} uColorSeed
 * @property {{value: number}} uColorDirectionX
 * @property {{value: number}} uColorSpeed
 * @property {{value: number}} uColorFreq
 * @property {{value: number}} uColorFreqY
 * @property {{value: number}} uColorNoiseFloor
 * @property {{value: number}} uColorNoiseCeil
 *
 * @property {{value: number}} uPerlinNoise
 */

/**
 * @typedef IgetLavaLampReturnType,
 * @property {Scene} scene
 * @property {Mesh} mesh
 * @property {ShaderMaterial} material
 * @property {WebGLRenderer} renderer
 * @property {Camera} camera
 * @property {() => void} cleanup
 */
