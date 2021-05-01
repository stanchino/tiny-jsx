'use strict';

const babelConfig = require('@istanbuljs/nyc-config-babel');

module.exports = {
  ...babelConfig,
  all: true,
  'check-coverage': true,
  include: ['packages/core/*.js'],
  reporter: ['text', 'lcov'],
};
