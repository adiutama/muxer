const yaml = require('js-yaml')
const path = require('path')

class Workspace {
  constructor() {
    this.data = {}
  }

  static fromTemplate(name, directory) {
    const instance = new Workspace()

    instance.setName(name)
    instance.setDirectory(directory)
    instance.addWindow('editor', ['nvim .'], true)
    instance.addWindow('shell', [null])

    return instance
  }

  setName(name) {
    this.data.session_name = name
  }

  setDirectory(directory) {
    this.data.start_directory = directory
  }

  addWindow(name, commands, focus = false) {
    if (!this.data.windows) {
      this.data.windows = []
    }

    this.data.windows.push({
      window_name: name,
      panes: commands,
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
