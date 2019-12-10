const users = [];

const addUser = ({ id, username, room }) => {
	// ClEAN the data
	username = username[0].toUpperCase() + username.slice(1).trim().toLowerCase();
	room = room[0].toUpperCase() + room.slice(1).trim().toLowerCase();

	// VALIDATE the data
	if (!username || !room) {
		return {
			error : 'Vardas/Slapyvardis ir Kambarys yra PRIVALOMI!'
		};
	}

	// CHECK for existing USER
	const existingUser = users.find((user) => {
		return user.room === room && user.username === username;
	});

	// VALIDATE username
	if (existingUser) {
		return {
			error : 'Toks Vardas/Slapyvardis jau egzistuoja! Susigalvokite kitokį ;-)'
		};
	}

	// STORE user
	const user = { id, username, room };
	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUser = (id) => {
	return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
	room = room[0].toUpperCase() + room.slice(1).trim().toLowerCase();
	return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
