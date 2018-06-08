const fs = require('fs')

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

module.exports = accessFile
