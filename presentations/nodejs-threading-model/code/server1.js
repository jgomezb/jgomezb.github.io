var connect = require('connect');
var serveStatic = require('serve-static');
var server = connect().use(serveStatic(__dirname))
    server.listen(8080);
