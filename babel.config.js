module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: false,
        useBuiltIns: 'entry',
        modules: false,
        targets: { browsers: ['> 0.25%, not dead', 'IE >= 9'] },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-transform-react-jsx', { pragma: 'TinyJSX.createElement', pragmaFrag: 'TinyJSX.Fragment' }],
  ],
};
