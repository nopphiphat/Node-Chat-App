// Server

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words') // For filtering bad-words
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app) // Refactoring (not changing the behavior)
const io = socketio(server) // Configure socketio to work with the given raw http server

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => { // Socket is an object that contains information about the connection; (built-in event: connection)
	console.log('New WebSocket connection established.') // Print message when new client connects
	// socket.emit('message', generateMessage('Welcome!'))  // (custom event: message); server (emit) -> client (receive) - message; 'Welcome!' is the argument passsed.
	// socket.broadcast.emit('message', generateMessage('A new user has joined')) // send message to others except the sender

	socket.on('join', (options, callback) => {
		const {error, user} = addUser({id:socket.id, ...options}) // spread operator 
		if (error) {
			return callback(error)
		}

		socket.join(user.room)

		socket.emit('message', generateMessage('Admin','Welcome!'))  
		socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`)) // broadcast to everyone in the room except user
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		})
		callback()
	})

	socket.on('sendMessage', (message, callback) => { // client (emit) -> server (receive) - sendMessage
		const user = getUser(socket.id) // Get the user id
		
		const filter = new Filter()
		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed!')
		}
		io.to(user.room).emit('message', generateMessage(user.username, message)) // io.emit emits event to every single connection whileas socket.emit emits to specific connection
		callback()
	})
	socket.on('sendLocation', (coords, callback) => {
		const user = getUser(socket.id)
		io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q${coords.latitude},${coords.longitude}`)) // Send location as google map link
		callback()
	})
	socket.on('disconnect', () => { // Built-in event: disconnect
		const user = removeUser(socket.id) // Remove user id
		if (user) {
			io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`)) // Socket already left, so it no longer exists
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room)
			})
		}
		
	})
})

server.listen(port, () => { // Using server.listen instead of app.listen
	console.log(`Server is up on port ${port}!`)
})