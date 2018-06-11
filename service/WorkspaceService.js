const path = require('path')
const untildify = require('untildify')
const shell = require('shelljs')

const accessFile = require('../helper/accessFile')
const readFile = require('../helper/readFile')
const writeFile = require('../helper/writeFile')
const directoryList = require('../helper/directoryList')

const Model = require('../model/Workspace')

const ENV_KEY = {
  HOME: 'MUXER_HOME',
  CONFIG: 'MUXER_CONFIG',
}

const HOME_DIR = process.env[ENV_KEY.HOME]
const CONFIG_DIR =
  process.env[ENV_KEY.CONFIG] || path.join(HOME_DIR, '.muxer_config')

const pathResolve = target => path.resolve(untildify(target))

const resolveConfigFile = target =>
  path.format({
    dir: pathResolve(CONFIG_DIR),
    name: target.replace(path.sep, '-'),
    ext: '.yaml',
  })

const getHomePath = () => HOME_DIR

const list = () => {
  return directoryList(CONFIG_DIR)
    .then(list => {
      const data = list.map(value => {
        return readFile(path.join(CONFIG_DIR, value))
      })

      return Promise.all(data)
    })
    .then(list => {
      return list.map(value => {
        return Model.load(value).getName()
      })
    })
}

const resolve = target => {
  const dir = pathResolve(path.join(HOME_DIR, target))
  const sortDir = dir.replace(HOME_DIR, `$${ENV_KEY.HOME}`)
  const configFile = resolveConfigFile(target)
  const configDir = path.dirname(configFile)

  return { dir, sortDir, configFile, configDir }
}

const create = target => {
  const { dir, sortDir, configFile, configDir } = resolve(target)

  const content = new Model()

  content.setName(target)
  content.setDirectory(sortDir)
  content.addWindow('editor', ['nvim .'], true)
  content.addWindow('shell', [null])

  shell.mkdir('-p', dir)
  shell.mkdir('-p', configDir)

  return accessFile(configFile).then(() =>
    writeFile(configFile, content.toString())
  )
}

module.exports = {
  getHomePath,
  resolve,
  list,
  create,
}
