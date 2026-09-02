// 简易本地服务器：让手机同一 WiFi 下也能访问本教学网页
// 用法：先 node server.js，再打开 http://本机IP:8080
var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');

var PORT = 8080;
var ROOT = __dirname;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.json': 'application/json'
};

function getLANIP() {
  var ifaces = os.networkInterfaces();
  for (var name in ifaces) {
    ifaces[name].forEach(function (iface) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return; // 只取外形IP（用闭包收集）
      }
    });
  }
  // 重新收集
  var ips = [];
  for (var n in os.networkInterfaces()) {
    os.networkInterfaces()[n].forEach(function (i) {
      if (i.family === 'IPv4' && !i.internal) ips.push(i.address);
    });
  }
  return ips;
}

var server = http.createServer(function (req, res) {
  var urlPath = decodeURIComponent(req.url.split('?')[0]);
  var filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('禁止访问'); }

  fs.readFile(filePath, function (err, data) {
    if (err) {
      // 找不到则返回 index.html（SPA 兜底）
      fs.readFile(path.join(ROOT, 'index.html'), function (e2, d2) {
        if (e2) { res.writeHead(404); return res.end('404'); }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(d2);
      });
      return;
    }
    var ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', function () {
  var ips = getLANIP();
  console.log('✅ 已启动，本机打开: http://localhost:' + PORT);
  ips.forEach(function (ip) {
    console.log('📱 手机访问（需同一WiFi）: http://' + ip + ':' + PORT);
  });
});
