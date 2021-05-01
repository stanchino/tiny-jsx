'use strict';

const babelConfig = require('@istanbuljs/nyc-config-babel');

module.exports = {
  ...babelConfig,
  all: true,
  'check-coverage': true,
  include: ['packages/**/*.js'],
  reporter: ['text', 'lcov'],
};
