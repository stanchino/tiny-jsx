import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import copy from 'rollup-plugin-copy';
import gzipPlugin from 'rollup-plugin-gzip';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;
const plugins = [
  resolve({
    mainFields: ['module', 'main', 'browser'],
  }),
  commonjs(),
  production && terser(),
  production && gzipPlugin(),
  analyze(),
];

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'TinyJSX',
      file: 'dist/tiny-jsx.js',
      format: 'iife',
      sourcemap: !production && 'inline',
      target: 'web',
      exports: 'named',
    },
    plugins,
  },
  {
    input: 'src/dom/index.js',
    external: ['..'],
    output: {
      name: 'TinyDOM',
      file: 'dist/tiny-jsx-dom.js',
      format: 'iife',
      sourcemap: !production && 'inline',
      exports: 'named',
      target: 'web',
      globals: {
        '..': 'TinyJSX.emitter',
      },
    },
    plugins,
  },
  {
    input: 'src/emitter/index.js',
    output: [
      { dir: 'dist/cjs/emitter', format: 'cjs', exports: 'named', entryFileNames: '[name].js', target: 'node' },
      { dir: 'dist/emitter', format: 'esm', exports: 'named', entryFileNames: '[name].js', target: 'node' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/dom/index.js',
    external: ['..'],
    output: [
      { dir: 'dist/cjs/dom', format: 'cjs', exports: 'named', entryFileNames: '[name].js', target: 'node' },
      { dir: 'dist/dom', format: 'esm', exports: 'named', entryFileNames: '[name].js', target: 'node' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze()
    ]
  },
  {
    input: 'src/index.js',
    external: ['./emitter'],
    output: [
      { dir: 'dist/cjs', format: 'cjs', exports: 'named', entryFileNames: '[name].js', target: 'node' },
      { dir: 'dist', format: 'esm', exports: 'named', entryFileNames: '[name].js', target: 'node' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      copy({
        targets: {
          'README.md': 'dist/README.md',
          'src/package.json': 'dist/package.json',
        }
      }),
      analyze(),
    ]
  },
];
