const fs = require('fs')

const directoryList = target =>
  new Promise((resolve, reject) => {
    fs.readdir(target, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })

module.exports = directoryList
