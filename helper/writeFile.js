const fs = require('fs')

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

module.exports = writeFile
