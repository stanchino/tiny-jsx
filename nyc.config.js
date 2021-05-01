'use strict';

const babelConfig = require('@istanbuljs/nyc-config-babel');

module.exports = {
  ...babelConfig,
  all: true,
  'check-coverage': true,
  include: ['src/core/*.js'],
  reporter: ['text', 'lcov'],
};
