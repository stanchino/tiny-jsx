import { compress } from 'brotli';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import copy from 'rollup-plugin-copy';
import gzipPlugin from 'rollup-plugin-gzip';

const plugins = [
  resolve({
    mainFields: ['module', 'main', 'browser'],
  }),
  commonjs(),
  gzipPlugin(),
  gzipPlugin({
    customCompression: content => compress(Buffer.from(content)),
    fileName: '.br',
  }),
  analyze(),
];

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'TinyJSX',
      file: 'dist/tiny-jsx.dev.js',
      format: 'iife',
      sourcemap: 'inline',
      exports: 'named',
    },
    plugins,
  },
  {
    input: 'src/index.js',
    output: {
      name: 'TinyJSX',
      file: 'dist/tiny-jsx.min.js',
      format: 'iife',
      sourcemap: false,
      exports: 'named',
    },
    plugins: [
      ...plugins,
      terser(),
    ],
  },
  {
    input: 'src/dom/index.js',
    external: ['..'],
    output: {
      name: 'TinyJSXDom',
      file: 'dist/tiny-jsx-dom.dev.js',
      format: 'iife',
      sourcemap: 'inline',
      exports: 'named',
      globals: {
        '..': 'TinyJSX',
      },
    },
    plugins,
  },
  {
    input: 'src/dom/index.js',
    external: ['..'],
    output: {
      name: 'TinyJSXDom',
      file: 'dist/tiny-jsx-dom.min.js',
      format: 'iife',
      sourcemap: false,
      exports: 'named',
      globals: {
        '..': 'TinyJSX',
      },
    },
    plugins: [
      ...plugins,
      terser(),
    ],
  },
  {
    input: 'src/hooks/index.js',
    external: ['..'],
    output: {
      name: 'TinyJSXHooks',
      file: 'dist/tiny-jsx-hooks.dev.js',
      format: 'iife',
      sourcemap: 'inline',
      exports: 'named',
      globals: {
        '..': 'TinyJSX',
      },
    },
    plugins,
  },
  {
    input: 'src/hooks/index.js',
    external: ['..'],
    output: {
      name: 'TinyJSXHooks',
      file: 'dist/tiny-jsx-hooks.min.js',
      format: 'iife',
      sourcemap: false,
      exports: 'named',
      globals: {
        '..': 'TinyJSX',
      },
    },
    plugins: [
      ...plugins,
      terser(),
    ],
  },
  {
    input: 'src/router/index.js',
    external: ['..'],
    output: {
      name: 'TinyJSXRouter',
      file: 'dist/tiny-jsx-router.dev.js',
      format: 'iife',
      sourcemap: 'inline',
      exports: 'named',
      globals: {
        '..': 'TinyJSX',
      },
    },
    plugins,
  },
  {
    input: 'src/router/index.js',
    external: ['..'],
    output: {
      name: 'TinyJSXRouter',
      file: 'dist/tiny-jsx-router.min.js',
      format: 'iife',
      sourcemap: false,
      exports: 'named',
      globals: {
        '..': 'TinyJSX',
      },
    },
    plugins: [
      ...plugins,
      terser(),
    ],
  },
  {
    input: 'src/emitter/index.js',
    output: [
      { dir: 'dist/emitter', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/emitter', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/core.js',
    external: ['..'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useCallback.js',
    external: ['./useMemo', './core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useContext.js',
    external: ['./core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useDebugValue.js',
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useEffect.js',
    external: ['./core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useImperativeHandle.js',
    external: ['./core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useLayoutEffect.js',
    external: ['./core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useMemo.js',
    external: ['./core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useReducer.js',
    external: ['./core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },

  {
    input: 'src/hooks/useRef.js',
    external: ['./core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/useState.js',
    external: ['./useReducer', './core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/core.js',
    external: ['..'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/hooks/index.js',
    external: ['./useCallback', './useContext', './useDebugValue', './useEffect', './useImperativeHandle', './useMemo', './useReducer', './useRef', './useState', './core'],
    output: [
      { dir: 'dist/hooks', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/hooks', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
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
      { dir: 'dist/dom', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/dom', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/server/index.js',
    external: ['..'],
    output: [
      { dir: 'dist/server', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/server', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/router/index.js',
    external: ['..', '../hooks/useEffect', '../hooks/useMemo', '../hooks/useState'],
    output: [
      { dir: 'dist/router', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es/router', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze(),
    ]
  },
  {
    input: 'src/index.js',
    external: ['../emitter', './emitter'],
    output: [
      { dir: 'dist', format: 'cjs', exports: 'named', entryFileNames: '[name].js' },
      { dir: 'dist/es', format: 'esm', exports: 'named', entryFileNames: '[name].js' },
    ],
    plugins: [
      resolve(),
      commonjs(),
      copy({
        targets: [
          { src: 'README.md', dest: 'dist/' },
          { src: 'package.json', dest: 'dist/' },
        ]
      }),
      analyze(),
    ]
  },
];
