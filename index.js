#!/usr/bin/env node

const program = require('commander')
const kexec = require('kexec')
const path = require('path')
const untildify = require('untildify')
const yaml = require('js-yaml')
const fs = require('fs')
const shell = require('shelljs')

const ConfigModel = require('./model/Config')

const envKey = {
  home: 'MUXER_HOME',
  config: 'MUXER_CONFIG',
}

// Constant
const HOME_DIR = process.env[envKey.home]
const CONFIG_DIR = process.env[envKey.config] || path.join(HOME_DIR, '.config')

const pathResolve = target => path.resolve(untildify(target))
const parseConfigName = target => target.split(path.sep).join('.')
const getTargetPath = target => pathResolve(path.join(HOME_DIR, target))
const getTargetShellPath = target => path.join(`$${envKey.home}`, target)
const getConfigFile = target => {
  return path.format({
    dir: pathResolve(CONFIG_DIR),
    name: parseConfigName(target),
    ext: '.yaml',
  })
}

// Actions
const createAction = target => {
  const configName = parseConfigName(target)
  const targetPath = getTargetPath(target)
  const targetShellPath = getTargetShellPath(target)
  const configFile = getConfigFile(target)

  const config = ConfigModel.fromTemplate(configName, targetShellPath)

  shell.mkdir('-p', targetPath)
  shell.mkdir('-p', path.dirname(configFile))

  fs.access(configFile, err => {
    if (!err) {
      throw new Error('Config file is exists')
    }

    fs.writeFile(configFile, config.toString(), err => {
      if (!err) {
        console.log('Workspace has been successfuly created')
        return
      }

      switch (err.code) {
        case 'EACCES':
          throw Error('Access Denied')
      }
    })
  })
}

const startAction = (...target) => {
  const options = target.pop()

  const configPath = target.reduce((carry, value) => {
    const file = getConfigFile(value)

    return carry + ' ' + file
  }, '')

  kexec(`tmuxp load ${configPath}`)
}

program
  .command('create <target>')
  .description('Create workspace')
  .action(createAction)

program
  .command('start')
  .description('Start workspace')
  .action(startAction)

program.parse(process.argv)
