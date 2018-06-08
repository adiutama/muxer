const fs = require('fs')
const path = require('path')
const kexec = require('kexec')
const shell = require('shelljs')
const untildify = require('untildify')
const { execSync } = require('child_process')

const accessFile = require('./helper/accessFile')
const writeFile = require('./helper/writeFile')

const ConfigModel = require('./model/Config')

// Variables
const envKey = {
  home: 'MUXER_HOME',
  config: 'MUXER_CONFIG',
}

const HOME_DIR = process.env[envKey.home]
const CONFIG_DIR = process.env[envKey.config] || path.join(HOME_DIR, '.config')

// Methods
const pathResolve = target => path.resolve(untildify(target))
const getTargetDir = target => pathResolve(path.join(HOME_DIR, target))

const getConfigFile = target =>
  path.format({
    dir: pathResolve(CONFIG_DIR),
    name: target.replace(path.sep, '-'),
    ext: '.yaml',
  })

const getActiveList = () =>
  shell
    .exec('tmux ls 2> /dev/null', { silent: true })
    .stdout.replace(/(:.*)/, '')
    .split('\n')
    .filter(value => value)

// Actions
const editAction = target => {
  const filename = getConfigFile(target)

  kexec(`\$EDITOR ${filename}`)
}

const createAction = (target, opts) => {
  const configFile = getConfigFile(target)
  const targetDir = getTargetDir(target)
  const targetShortDir = targetDir.replace(HOME_DIR, `$${envKey.home}`)

  const config = ConfigModel.fromTemplate(target, targetShortDir)

  shell.mkdir('-p', targetDir)
  shell.mkdir('-p', path.dirname(configFile))

  accessFile(configFile)
    .then(() => writeFile(configFile, config.toString()))
    .then(() => {
      if (!opts.force) {
        editAction(target)
      }
    })
    .catch(err => {
      switch (err.code) {
        case 'EACCES':
          return console.error('Cannot access the directory')

        default:
          return console.error(err.message)
      }
    })
}

const listAction = () => {
  const list = getActiveList()

  if (!list.length) {
    return console.error('No active workspace')
  }

  console.log('Active workspaces:')

  list.forEach(value => console.log('- ', value))
}

const openAction = target => {
  const filename = target.map(value => getConfigFile(value)).join(' ')

  kexec(`tmuxp load ${filename}`)
}

const closeAction = (target, opts) => {
  if (!opts.all && !target.length) {
    console.error('Please specify target path')
  }

  let workspaces = opts.all ? getActiveList() : target

  workspaces.forEach(value => {
    shell.exec(`tmux kill-session -t ${value}`)
  })
}

module.exports = {
  createAction,
  editAction,
  listAction,
  openAction,
  closeAction,
}
