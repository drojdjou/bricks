// https://developer.chrome.com/apps/first_app

chrome.app.runtime.onLaunched.addListener(function() {

	chrome.app.window.create('index.html', {
		frame: 'none',
		state: 'maximized' // fullscreen
	});
});