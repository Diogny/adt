"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var http_1 = require("http");
var path = tslib_1.__importStar(require("path"));
var url_1 = tslib_1.__importDefault(require("url"));
var fs = tslib_1.__importStar(require("fs"));
var port = 5000;
console.log('process.execPath', process.execPath);
console.log(process.argv);
var appFolder = path.resolve(path.dirname(process.argv[1]), 'www'); // path.resolve(process.argv[0], '..');
console.log('app folder', appFolder);
var server = http_1.createServer(function (request, response) {
    try {
        //response.end('Hello world!');
        var requestUrl = url_1.default.parse(request.url);
        var filepath = path.join(appFolder, requestUrl.path);
        console.log('serving: ', filepath);
        var fileStream = fs.createReadStream(filepath);
        fileStream.pipe(response);
        fileStream.on('open', function () {
            response.writeHead(200);
        });
        fileStream.on('error', function (e) {
            response.writeHead(404); // assume the file doesn't exist
            response.end();
        });
    }
    catch (e) {
        response.writeHead(500);
        response.end(); // end the response so browsers don't hang
        console.log(e.stack);
    }
})
    .listen(port, function () {
    console.log("Server listening on port " + port);
});
//# sourceMappingURL=server.js.map