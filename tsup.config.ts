import { defineConfig } from 'tsup';

export default defineConfig({

  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2019',
  external: ['react', 'react-dom']

});
