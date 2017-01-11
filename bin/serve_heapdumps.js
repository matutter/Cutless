const fs = require('fs')

process.chdir('..')

var files = fs.readdirSync('.')
  .filter(name => ~name.indexOf('heap'))

console.log(files)

var server = require('http').createServer(function(req, res) {
  console.log(req.url)
  if (req.url == '/') {
    res.writeHead(200, {'Content-Type':'text/html'})
    res.write('<html><ul>')
    files.forEach(name => {
      res.write(`<li><a href="/${name}">${name}</a></li>\n`)
    })
    res.end('</ul></html>')
  } else {
    var file = req.url.replace(/^[^a-zA-Z]+/, '')
    console.log('requested', file)
    if(~files.indexOf(file))
      fs.createReadStream(file).pipe(res)
    else {
      res.end('No such file.')
    }
  } 
})

server.listen(8080)