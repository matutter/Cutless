const createServer = require('http').createServer

/**
* Creates an HTTP server returning a Promise wrapped 'listen' method
*/
module.exports.createServer = function(app, port) {
  const server = createServer(app)
  const listen = server.listen.bind(server)

  return {
    port: port,
    // Wrap listen in a promise, Promise.promisify doesn't work for some reason
    listen : function() {
      return new Promise((resolve, reject) => {
        listen(port, e => {
          if(e) return reject(e)
          resolve()
        })
      })
    }
  }
}