module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        loose: false,
        useBuiltIns: 'entry',
        corejs: 3,
        modules: false,
        targets: { browsers: ['> 0.25%, not dead', 'IE >= 9'] },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-transform-react-jsx', { pragma: 'TinyJSX.createElement', pragmaFrag: 'TinyJSX.Fragment' }],
  ].filter(Boolean),
};
