require('dotenv').config({silent: true});

if (!process.env.BOT_TOKEN) {
    process.exit(1);
}

require("./src/index.js");

const PORT = 4390;
const http = require('http');
const server = http.createServer(function(request, response){
	console.log(request.url);
});

server.listen(4390, function(){
  console.log('Listening on port ' + PORT);
});
