#!/usr/bin/env node

const program = require('commander')

const { createAction, openAction, closeAction } = require('./action')

program
  .command('create <target>')
  .description('Create new workspace')
  .action(createAction)

program
  .command('open <target...>')
  .description('Open workspace')
  .action(openAction)

program
  .command('close [target...]')
  .option('-a, --all', 'Close all active workspace')
  .description('Close workspace')
  .action(closeAction)

program.parse(process.argv)
