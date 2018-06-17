const EventEmitter = require('events')
const kexec = require('kexec')
const shell = require('shelljs')
const trash = require('trash')

const activeList = require('./helper/activeList')

const WorkspaceService = require('./service/WorkspaceService')

// Variables
const emitter = new EventEmitter()

// Actions
emitter.on('browse', () => {
  shell.exec(`open ${WorkspaceService.getHomePath()}`)
})

emitter.on('list', () => {
  WorkspaceService.list().then(list => {
    if (!list.length) {
      return console.log('No avaliable workspace.')
    }

    console.log('Available workspace:')

    list.forEach(value => {
      console.log('-', value)
    })
  })
})

emitter.on('remove', (target, opts) => {
  const progress = target.map(value => {
    const { dir, configFile } = WorkspaceService.resolve(value)

    if (opts.keepDir) {
      return trash(configFile)
    } else {
      return trash([dir, configFile])
    }
  })

  Promise.all(progress).then(() => {
    console.log('Workspace has been successfully removed.')
  })
})

emitter.on('create', (target, opts) => {
  WorkspaceService.create(target)
    .then(() => {
      if (!opts.force) {
        emitter.emit('edit', target)
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
})

emitter.on('edit', target => {
  const { configFile } = WorkspaceService.resolve(target)

  kexec(`\$EDITOR ${configFile}`)
})

emitter.on('active', target => {
  const list = activeList()

  if (!list.length) {
    return console.error('No active workspace')
  }

  console.log('Active workspaces:')

  list.forEach(value => console.log('- ', value))
})

emitter.on('open', target => {
  const getDir = target => WorkspaceService.resolve(target).configFile
  const filename = target.map(value => getDir(value)).join(' ')

  kexec(`tmuxp load ${filename}`)
})

emitter.on('close', (target, opts) => {
  if (!opts.all && !target.length) {
    console.error('Please specify target path')
  }

  let workspaces = opts.all ? activeList() : target

  workspaces.forEach(value => {
    shell.exec(`tmux kill-session -t ${value}`)
  })
})

module.exports = emitter
