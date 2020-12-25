// Client

const socket = io() // Connect to server

// Elements - Creating variable constants, prefix with '$' sign (element from DOM)
const $messageForm = document.querySelector('#message-form') 
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML 
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true}) // Get the value passed as argument from url

const autoscroll = () => {
	// New message element
	const $newMessage = $messages.lastElementChild // Get last element
	
	// Get Height of the new message
	const newMessageStyles = getComputedStyle($newMessage) 
	const newMessageMargin = parseInt(newMessageStyles.marginBottom) // Get margin value
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin // Add margin to height of message to get total height

	// Visible height
	const visibleHeight = $messages.offsetHeight

	// Height of messages container
	const containerHeight = $messages.scrollHeight

	// How far have I scrolled?
	const scrollOffset = $messages.scrollTop + visibleHeight // Scrolltop is the amount of distance we scroll from the top. Top: 0, Bottom larger value
	
	if (containerHeight - newMessageHeight <= scrollOffset) { // subtract the height of last message, taking new message out of the mix
		$messages.scrollTop = $messages.scrollHeight
	}
}

socket.on('message', (message) => { // name "message" needs to match socket.emit()
	console.log(message) 
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html) // afterbegin (Top,inside div) | beforeend (Bottom, inside div)
	autoscroll()
})

socket.on('locationMessage', (message) => { // Listen for 'locationMessage' event
	console.log(message)
	const html = Mustache.render(locationMessageTemplate, {
		username: message.username,
		url: message.url,
		createdAt: moment(message.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
	autoscroll()
})

socket.on('roomData', ({room, users}) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users
	})
	document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault() // Prevent default (refresh)
	
	$messageFormButton.setAttribute('disabled', 'disabled') // Disable (submit button) form, set "disabled" to "disabled".
	
	const message = e.target.elements.message.value // .target (form) | .elements (element property) | .message (input name) | .value (value)
	socket.emit('sendMessage', message, (error) => { // Emit sendMessage along with the message value when acknowledged
		$messageFormButton.removeAttribute('disabled') // Enable form, removed "disabled" attribute to enable the submit button.
		$messageFormInput.value = '' // Clear previous input value
		$messageFormInput.focus() // move the cursor inside of the text box -> allows fast typing so more convenient
		if (error) {
			return console.log(error)
		}
		console.log('Message delivered!')
	}) 
})

$sendLocationButton.addEventListener('click', () => {
	if (!navigator.geolocation) { // Check if the geolocation feature is supported.
		return alert('Geolocation is not supported by your browser')
	}

	$sendLocationButton.setAttribute('disabled', 'disabled') // add disabled attribute

	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {
			$sendLocationButton.removeAttribute('disabled') // remove disabled attribute
			console.log('Location shared!')
		})
	})
})

socket.emit('join', {username, room}, (error) => {
	if (error) {
		alert(error)
		location.href = '/' // Send user to the root of the site.
	}
})