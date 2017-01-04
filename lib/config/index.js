module.exports.load = load

const path = require('path')
const fs = require('fs')
var ini = require('ini')

/**
* Loads all .conf or .ini files in a directory and Assigns their
* resulting parsed objects into a single object.
* @param configs_path - Path to configurations directory.
* @return Promise
* @promise - Composite object of all configs, combined with Object.assign
*/
function load(configs_path) {
  const readdir = Promise.promisify(fs.readdir)
  const readFile = Promise.promisify(fs.readFile)
  return readdir(configs_path)
    .then(file_names => file_names
      .filter(name => name.endsWith('.conf'))
      .map(name => ({
        path: path.join(configs_path, name),
        name: name.replace('.conf', ''),
        text: null
      }))
      .map(file => readFile(file.path, 'utf8')
        .then(text => ini.parse(text))))
    .then(Promise.all)
    .spread(Object.assign)
}