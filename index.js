var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('client-sessions');

app.use(session({
	cookieName: 'session',
	secret: 'qwerty',

}));
var all_users = [];
// var tmp;
app.get('/', function(req, res) {
	sess = req.session;
	sess.user = 'unknown';
	res.sendFile(__dirname + '/index.html');
});

// app.get('/login', function(req, res) {
// 	res.render(__dirname + '/login.html');
// });

io.on('connection', function(socket){
	console.log('user connected');
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
	socket.on('connected', function(msg){
		var req = socket.request;
		req.user = msg[0];
		all_users.push(msg[0]);
		io.emit('connected', msg[1], all_users);
	});
	socket.on('disconnect', function(){
		var index = all_users.indexOf(socket.request.user);
		all_users.splice(index, 1);
		console.log(all_users);
		io.emit('disconnect', socket.request.user + ' has disconnected', all_users);
		console.log('user disconnected');
	});
});



http.listen(3000, function(){
	console.log('listening on port 3000');
});