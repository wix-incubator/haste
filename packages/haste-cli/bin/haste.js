#!/usr/bin/env node

const runCLI = require('../src');

process.on('unhandledRejection', (error) => {
  throw error;
});

runCLI();
