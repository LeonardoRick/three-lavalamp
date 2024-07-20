import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
  },
  optimizeDeps: {
    exclude: ['@leonardorick/three', '@leonardorick/utils'],
  },
  assetsInclude: ['**/*.glb'],
  build: {
    lib: {
      entry: 'src/main.js',
      name: '@leonardorick/three-lavalamp-background',
      formats: ['es'],
    },
    rollupOptions: {
      input: {
        example1: './src/examples/1/index.html',
        example2: './src/examples/2/index.html',
      },
    },
  },
  server: {
    open: '/src/examples/1/index.html',
  },
});
