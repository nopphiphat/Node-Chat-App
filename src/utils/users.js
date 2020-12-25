const users = []

const addUser = ({ id, username, room }) => {
	// Clean the data
	username = username.trim().toLowerCase()
	room = room.trim().toLowerCase()
	
	// Validate the data
	if(!username || !room) {
		return {
			error: 'Username and room are required!'
		}
	}

	// Check for existing user
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username
	})

	// Validate username
	if (existingUser) {
		return {
			error: 'Username is in use!'
		}
	}

	// Store user
	const user = {id, username, room}
	users.push(user)
	return {user}
}

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id) // FindIndex stops when match is found
	if (index !== -1) { // Remove item from array if index matched, 1st arg: starting from "index", 2nd arg: no. items to be removed.
		return users.splice(index, 1)[0] // Return the removed item
	}
	
}

const getUser = (id) => {
	return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => { // Accept name of room being searched
	room = room.trim().toLowerCase()
	return users.filter((user) => user.room === room) // Return users who are in the room we are looking for
}

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
}