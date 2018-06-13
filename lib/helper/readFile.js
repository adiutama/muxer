const fs = require('fs')

const readFile = target =>
  new Promise((resolve, reject) => {
    fs.readFile(target, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

module.exports = readFile
