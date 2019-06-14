module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: false,
        useBuiltIns: 'entry',
        corejs: 3,
        modules: false,
        targets: { browsers: ['> 0.25%, not dead, ie >= 9'] },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-transform-react-jsx', { pragma: 'TinyJSX.createElement', pragmaFrag: 'TinyJSX.Fragment' }],
  ],
};
