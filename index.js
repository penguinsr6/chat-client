var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('client-sessions');

app.use(session({
	cookieName: 'session',
	secret: 'qwerty',

}));
var all_users = [];
var users_typing = [];
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
		all_users.push(msg[0]);
		io.emit('connected', msg[1], all_users);
	});
	socket.on('disconnect', function(){
		var index1 = all_users.indexOf(socket.request.user);
		var index2 = users_typing.indexOf(socket.request.user);
		all_users.splice(index1, 1);
		users_typing.splice(index2, 1);
		console.log(all_users);
		io.emit('disconnect', socket.request.user + ' has disconnected', all_users);
		io.emit('typing', users_typing);
		console.log('user disconnected');
	});
	socket.on('typing', function(user){
		console.log('current', users_typing);
		if (users_typing.indexOf(user) < 0) {
			console.log('adding user', user);
			users_typing.push(user);
			console.log('added', users_typing);
			io.emit('typing', users_typing);
		}
	});
	socket.on('typing_remove', function(user){
		console.log('current -to remove', user, users_typing);
		console.log(users_typing.indexOf(user));
		var index = users_typing.indexOf(user);
		if (index >= 0) {
			console.log('removing user', user);
			users_typing.splice(index, 1);
			console.log('removed', users_typing);
			io.emit('typing', users_typing);
		}
	});

});



http.listen(3000, function(){
	console.log('listening on port 3000');
});