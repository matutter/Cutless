const createServer = require('http').createServer

/**
* Creates an HTTP server returning a Promise wrapped 'listen' method
*/
module.exports.createServer = function(app, port) {
  const server = createServer(app)

  return {
    http_server: server,
    port: port,
    // Wrap listen in a promise, Promise.promisify doesn't work for some reason
    listen : function() {
      return new Promise((resolve, reject) => {
        server.listen(port, e => {
          if(e) return reject(e)
          resolve()
        })
      })
    }
  }
}