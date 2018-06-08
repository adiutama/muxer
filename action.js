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
const getActiveList = () =>
  shell
    .exec('tmux ls', { silent: true })
    .stdout.replace(/(:.*)/, '')
    .split('\n')
    .filter(value => value)

// Actions
const createAction = target => {
  const configName = parseConfigName(target)
  const targetPath = getTargetPath(target)
  const targetShellPath = getTargetShellPath(target)
  const configFile = getConfigFile(target)

  const config = ConfigModel.fromTemplate(target, targetShellPath)

  shell.mkdir('-p', targetPath)
  shell.mkdir('-p', path.dirname(configFile))

  fs.access(configFile, err => {
    if (!err) {
      console.error('Config file is exists')
    }

    fs.writeFile(configFile, config.toString(), err => {
      if (!err) {
        console.log('Workspace has been successfuly created')
        return
      }

      switch (err.code) {
        case 'EACCES':
          console.error('Cannot access the directory')
      }
    })
  })
}

const openAction = target => {
  const filename = target.reduce((carry, value) => {
    const file = getConfigFile(value)

    return carry + ' ' + file
  }, '')

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

module.exports = { createAction, openAction, closeAction }
