const shell = require('shelljs')

const activeList = () =>
  shell
    .exec('tmux ls 2> /dev/null', { silent: true })
    .stdout.replace(/(:.*)/g, '')
    .split('\n')
    .filter(value => value)

module.exports = activeList
