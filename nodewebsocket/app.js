/*
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
	   if(req.url == "/"){
		   res.writeHead(200, {'Content-Type': 'text/html'});
		   res.end('Web Socket');
	   }
	   else if(req.url == "/index"){
		   fs.readFile('index.html', function (error, data) {
	            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	            res.end(data);
	       });
	   }
});

server.listen(8000, function () {
  console.log('Server is listening on port 8000');
});


 wsServer = new WebSocketServer({
	  httpServer: server,
	  autoAcceptConnections: false
});

wsServer.on('request', function (request) {
	var connection = request.accept('example-echo', request.origin);
	connection.on('message', function (message) {
		if (message.type === 'utf8') {
	      console.log('Received message: ' + message.utf8Data);
	      connection.sendUTF(message.utf8Data);
	    }else if (message.type === 'binary') {
	      connection.sendBytes(message.binaryData);
	    }
	    connection.on('close', function (reasonCode, description) {
	        console.log('Peer ' + connection.remoteAddress + ' disconnected.');
	    });
	});
});

 */


/*
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const webSocket = require('./socket');
const indexRouter = require('./routes');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
	express: app,
	watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		secure: false,
	},
}));

app.use('/', indexRouter);

app.use((req, res, next) => {
	const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

const server = app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server);
 */


/*
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const webSocket = require('./socket');
const indexRouter = require('./routes');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
	express: app,
	watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		secure: false,
	},
}));

app.use('/', indexRouter);

app.use((req, res, next) => {
	const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

const server = app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기중');
});

const io = require('socket.io')(server); 


webSocket(server);
 */

/*
var http = require('http')
var client = require('dgram').createSocket('udp4')
var message = 'This is my first message, next time you will see message from server!!';

client.on("message", function(msg, rinfo) {
	message = msg;
});

client.on("error", function(err) {
	console.log("server error:\n" + err.stack);
	server.close();
});

http.createServer(function(req, res) {
	// control for favicon
	if (req.url === '/favicon.ico') {
		res.writeHead(200, {
			'Content-Type' : 'image/x-icon'
		});
		res.end();
		return;
	}

	var data = new Buffer('Client Buffer!!');
	client.send(data, 0, data.length, 4445, 'localhost');

	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	res.end('Hello World\n' + message);

}).listen(1338, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1338/');
 */

var http = require('http')
var client = require('net').Socket()
var fromServer = '';

client.connect(9999, function() {
	console.log('Connected succesfully!!');
});

//When I get 'data' from server,  put 'data' in 'message' to send in response
client.on('data', function(data) {
	console.log('Recieve data: ' + data);
	fromServer = data;
});

//Add a 'close' event handler for the client socket
client.on('close', function() {
	console.log('Connection closed');
	// Close the client socket completely
	client.destroy();
});

http.createServer(function(req, res) {

	// control for favicon
	if (req.url === '/favicon.ico') {
		res.writeHead(200, {
			'Content-Type' : 'image/x-icon'
		});
		res.end();
		return;
	}

	client.write('Who\'s there?\n', function() {
		console.log('Write data successfully!!');
	});
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	res.end('Hello World\n' + fromServer);
}).listen(1338, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1338/');

