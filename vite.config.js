import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  optimizeDeps: {
    exclude: ['@leonardorick/three'],
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: '@leonardorick/three-lavalamp-background',
      formats: ['es'],
    },
  },
});
