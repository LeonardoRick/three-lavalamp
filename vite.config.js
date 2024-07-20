import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    plugins: [glsl()],
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
      ...(!isProduction
        ? {
            rollupOptions: {
              input: {
                example1: './src/examples/1/index.html',
                example2: './src/examples/2/index.html',
              },
            },
          }
        : {}),
    },
    server: {
      open: '/src/examples/1/index.html',
    },
  };
});
