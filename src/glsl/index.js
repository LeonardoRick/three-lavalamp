import snoise from './functions/snoinse.glsl';
import vertex from './vertex.glsl';
import fragment from './fragment.glsl';
import { replaceShaderImport } from '@leonardorick/three';
const modules = {
  snoise,
};

const vertexShader = replaceShaderImport(vertex, modules);
const fragmentShader = replaceShaderImport(fragment, modules);

export { vertexShader, fragmentShader };
