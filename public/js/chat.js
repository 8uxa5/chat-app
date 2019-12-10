const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $shareLocationButton = document.querySelector('#share-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
	// NEW message element
	const $newMessage = $messages.lastElementChild;

	// Height of the NEW message
	const newMessageStyles = getComputedStyle($newMessage);
	const newMessageMargin = parseInt(newMessageStyles.marginBottom);
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

	// Visible Height
	const visibleHeight = $messages.offsetHeight;

	// Height off messages container
	const containerHeight = $messages.scrollHeight;

	// How far I have scrolled ???
	const scrollOffset = $messages.scrollTop + visibleHeight;

	if (containerHeight - newMessageHeight <= scrollOffset) {
		$messages.scrollTop = $messages.scrollHeight;
	}
};

socket.on('message', (message) => {
	console.log(message);
	const html = Mustache.render(messageTemplate, {
		username  : message.username,
		message   : message.text,
		createdAt : moment(message.createdAt).format('H:mm')
	});
	$messages.insertAdjacentHTML('beforeend', html);
	autoscroll();
});

socket.on('locationMessage', (message) => {
	console.log(message);
	const html = Mustache.render(locationMessageTemplate, {
		username  : message.username,
		url       : message.url,
		createdAt : moment(message.createdAt).format('H:mm')
	});
	$messages.insertAdjacentHTML('beforeend', html);
	autoscroll();
});

socket.on('roomData', ({ room, users }) => {
	const html = Mustache.render(sidebarTemplate, { room, users });
	document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
	// this--->e.preventDefault(); Let's YOU see messages in BROWSER CONSOLE
	e.preventDefault();

	$messageFormButton.setAttribute('disabled', 'disabled');

	// const message = document.querySelector('input').value;
	// TWO ways to do the same thing... Chosen is BOTTOM ONE
	const message = e.target.elements.message.value;

	socket.emit('sendMessage', message, (error) => {
		$messageFormButton.removeAttribute('disabled');
		$messageFormInput.value = '';
		$messageFormInput.focus();

		if (error) {
			return console.log(error);
		}

		console.log('The message was delivered!');
	});
});

$shareLocationButton.addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser');
	}

	$shareLocationButton.setAttribute('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit(
			'sendLocation',
			{
				latitude  : position.coords.latitude,
				longitude : position.coords.longitude
			},
			() => {
				$shareLocationButton.removeAttribute('disabled');
				console.log('Location shared!');
			}
		);
	});
});

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = '/';
	}
});
