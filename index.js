#!/usr/bin/env node

const program = require('commander')
const action = require('./action')

// Methods
const emit = event => (target, opts) => action.emit(event, target, opts)

// Main
program
  .command('create <target>')
  .option('-f, --force', 'Skip workspace editing after created')
  .description('Create new workspace')
  .action(emit('create'))

program
  .command('edit <target>')
  .description('Edit workspace')
  .action(emit('edit'))

program
  .command('list')
  .alias('ls')
  .description('List active workspace')
  .action(emit('list'))

program
  .command('open <target...>')
  .description('Open workspace')
  .action(emit('open'))

program
  .command('close [target...]')
  .option('-a, --all', 'Close all active workspace')
  .description('Close workspace')
  .action(emit('close'))

program.parse(process.argv)
