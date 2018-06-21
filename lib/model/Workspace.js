const yaml = require('js-yaml')
const path = require('path')

class Workspace {
  constructor() {
    this.data = {}
  }

  static load(data) {
    const instance = new Workspace()
    const parsed = yaml.safeLoad(data)

    instance.set(parsed)

    return instance
  }

  set(data) {
    this.data = data
  }

  setName(name) {
    this.data.session_name = name
  }

  getName() {
    return this.data.session_name
  }

  setDirectory(directory) {
    this.data.start_directory = directory
  }

  addWindow(name, commands, layout = 'even-vertical', focus = false) {
    if (!this.data.windows) {
      this.data.windows = []
    }

    this.data.windows.push({
      window_name: name,
      panes: commands,
      layout,
      focus,
    })
  }

  toObject() {
    return this.data
  }

  toString() {
    return yaml.safeDump(this.data)
  }
}

module.exports = Workspace
