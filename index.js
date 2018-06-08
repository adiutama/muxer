#!/usr/bin/env node

const program = require('commander')

const {
  createAction,
  editAction,
  listAction,
  openAction,
  closeAction,
} = require('./action')

program
  .command('create <target>')
  .option('-f, --force', 'Skip workspace editing after created')
  .description('Create new workspace')
  .action(createAction)

program
  .command('edit <target>')
  .description('Edit workspace')
  .action(editAction)

program
  .command('list')
  .alias('ls')
  .description('List active workspace')
  .action(listAction)

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
