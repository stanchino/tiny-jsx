module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        loose: true,
        exclude: [
          "@babel/plugin-transform-typeof-symbol"
        ],
        useBuiltIns: 'entry',
        corejs: 3,
        targets: { browsers: ['> 0.25%, not dead', 'IE >= 9'] },
        modules: false,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-export-namespace-from',
    ['@babel/plugin-transform-react-jsx', { pragma: 'TinyJSX.createElement', pragmaFrag: 'TinyJSX.Fragment' }],
  ],
};
