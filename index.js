#!/usr/bin/env node

const program = require('commander')

const { createAction, startAction } = require('./action')

program
  .command('create <target>')
  .description('Create workspace')
  .action(createAction)

program
  .command('start <target...>')
  .description('Start workspace')
  .action(startAction)

program.parse(process.argv)
