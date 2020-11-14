var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  pathname = pathname.substring(pathname.lastIndexOf("/"));

  console.log("pathname");
  console.log(pathname);
  console.log("queryData");
  console.log(queryData);
  console.log("__dirname");
  console.log(__dirname);

  if (request.url === "/") {
    _url = "/login.html";
    pathname = "/login.html";
  }

  if (request.url == "/favicon.ico") {
    return response.writeHead(404);
  }
  /*
  const regex = RegExp("/timer*");

  if (regex.test(pathname)) {
    if (pathname === "/timer.html" || pathname === "/timer.html/") {
      pathname = "/timer.html";
    } else {
      pathname = pathname.replace("/timer.html", "");
    }*/

  if (pathname === "/timer.html") {
    console.log("pathname edited");
    console.log(pathname);

    if (queryData.id === "start") {
      console.log("!start!");
    } else if (queryData.id === "switch") {
      console.log("!switch!");
    } else if (queryData.id === "start") {
      console.log("!finish!");
    } else {
      console.log("what..?");
    }
  }

  response.writeHead(200);
  response.end(fs.readFileSync(__dirname + pathname));
});
app.listen(3000);
