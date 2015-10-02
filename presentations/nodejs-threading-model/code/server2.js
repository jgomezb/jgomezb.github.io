var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    memcached = require('memcached');

var cache = new memcached('localhost:11211');

var error = function(response, status, err) {
  response.writeHead(status, {"Content-Type": "text/plain"});
  response.write(err + "\n");
  response.end();
};

var success = function(response, data) {
  response.writeHead(200);
  response.write(data, "binary");
  response.end();
};

http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

  cache.get(filename, function(err, data) {
    if (data !== undefined) return success(response, data);

    fs.exists(filename, function(exists) {
      if(!exists) return error(response, 404, "404 Not Found");

      fs.readFile(filename, "binary", function(err, file) {
        if(err) return error(response, 500, err);

        cache.set(filename, file, 10, function (err) {
          success(response, file);
        });
      });
    });
  });
}).listen(8080);

console.log("Static file server: http://localhost:8080");
