#!/usr/bin/env node

const program = require('commander')
const action = require('./action')

// Methods
const emit = event => (target, opts) => action.emit(event, target, opts)

// Main
program
  .command('browse')
  .description('Browse workspace directory')
  .action(emit('browse'))

program
  .command('list')
  .alias('ls')
  .description('List available workspace')
  .action(emit('list'))

program
  .command('remove <target...>')
  .alias('rm')
  .option('--keep-dir', 'Remove config file but keep the project directory.')
  .description('Remove workspace')
  .action(emit('remove'))

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
  .description('Close workspace')
  .action(emit('close'))

program
  .command('close-all')
  .description('Close all workspace')
  .action(emit('close-all'))

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
