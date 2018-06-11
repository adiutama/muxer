#!/usr/bin/env node

const program = require('commander')
const action = require('./action')

// Methods
const emit = event => (target, opts) => action.emit(event, target, opts)

// Main
program
  .command('list')
  .alias('ls')
  .description('List available workspace')
  .action(emit('list'))

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
  .command('active')
  .description('List active workspace')
  .action(emit('active'))

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
