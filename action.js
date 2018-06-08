const fs = require('fs')
const path = require('path')
const kexec = require('kexec')
const shell = require('shelljs')
const untildify = require('untildify')

const ConfigModel = require('./model/Config')

const envKey = {
  home: 'MUXER_HOME',
  config: 'MUXER_CONFIG',
}

// Constant
const HOME_DIR = process.env[envKey.home]
const CONFIG_DIR = process.env[envKey.config] || path.join(HOME_DIR, '.config')

const pathResolve = target => path.resolve(untildify(target))
const parseConfigName = target => target.split(path.sep).join('-')
const getTargetPath = target => pathResolve(path.join(HOME_DIR, target))
const getTargetShellPath = target => path.join(`$${envKey.home}`, target)

const getConfigFile = target => {
  return path.format({
    dir: pathResolve(CONFIG_DIR),
    name: parseConfigName(target),
    ext: '.yaml',
  })
}

const accessFile = filename =>
  new Promise((resolve, reject) =>
    fs.access(filename, err => {
      if (err) {
        resolve(filename)
      } else {
        reject(Error('Config file has already exists'))
      }
    })
  )

const writeFile = (filename, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filename, content, err => {
      if (err) {
        reject(err)
      } else {
        resolve(filename)
      }
    })
  })

const getActiveList = () =>
  shell
    .exec('tmux ls', { silent: true })
    .stdout.replace(/(:.*)/, '')
    .split('\n')
    .filter(value => value)

// Actions
const editAction = target => {
  const filename = getConfigFile(target)

  kexec(`\$EDITOR ${filename}`)
}

const createAction = (target, opts) => {
  const configName = parseConfigName(target)
  const targetPath = getTargetPath(target)
  const targetShellPath = getTargetShellPath(target)
  const configFile = getConfigFile(target)

  const config = ConfigModel.fromTemplate(target, targetShellPath)

  shell.mkdir('-p', targetPath)
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
  console.log('Currently active workspaces:')

  getActiveList().forEach(value => console.log('- ', value))
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
