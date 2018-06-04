const yaml = require('js-yaml')
const path = require('path')

class Config {
  constructor() {
    this.data = {}
  }

  static fromTemplate(name, directory) {
    const instance = new Config()

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
    // const value = directory.replace(this.basePath, '$MUXER_HOME/')

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

module.exports = Config
