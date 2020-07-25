"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = require("http");
const path = tslib_1.__importStar(require("path"));
const url_1 = tslib_1.__importDefault(require("url"));
const fs = tslib_1.__importStar(require("fs"));
const port = 5000;
console.log('process.execPath', process.execPath);
console.log(process.argv);
const appFolder = path.resolve(path.dirname(process.argv[1]), 'www'); // path.resolve(process.argv[0], '..');
console.log('app folder', appFolder);
const server = http_1.createServer((request, response) => {
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
    .listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
