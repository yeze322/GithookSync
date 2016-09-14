var http = require('http')
var createHandler = require('github-webhook-handler')
var handler_react = createHandler({ path: '/', secret: '0xffffffff' }) 
// 上面的 secret 保持和 GitHub 后台设置的一致
 
function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";
 
  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}
 
http.createServer(function (req, res) {
  handler_react(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(3334)
 
handler_react.on('error', function (err) {
  console.error('Error:', err.message)
})
 
handler_react.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  run_cmd('sh', ['./nodeApi.sh'], function(text){ console.log(text) });
})
 
/*
handler.on('issues', function (event) {
  console.log('Received an issue event for % action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
*/
