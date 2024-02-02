import shared from './functions/shared.glsl';
import snoise from './functions/snoinse.glsl';
import cnoise from './functions/cnoise.glsl';
import vertex from './vertex.glsl';
import fragment from './fragment.glsl';
import { replaceShaderImport } from '@leonardorick/three';
const modules = {
  shared,
  snoise,
  cnoise,
};

const vertexShader = replaceShaderImport(vertex, modules);
const fragmentShader = replaceShaderImport(fragment, modules);

export { vertexShader, fragmentShader };
