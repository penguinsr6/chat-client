var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('client-sessions');

app.use(session({
	cookieName: 'session',
	secret: 'qwerty',

}));
// var tmp;
app.get('/', function(req, res) {
	sess = req.session;
	sess.user = 'unknown';
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('user connected');
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
	socket.on('connected', function(msg){
		var req = socket.request;
		req.user = msg[0];
		io.emit('connected', msg[1]);
	});
	socket.on('disconnect', function(){
		io.emit('disconnect', socket.request.user + ' has disconnected');
		console.log('user disconnected');
	});
});



http.listen(3000, function(){
	console.log('listening on port 3000');
});