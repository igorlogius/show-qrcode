// get current activ tab
browser.tabs.query({active: true, currentWindow: true}).then( (tabs) => {

	if ( !Array.isArray(tabs) ) { return; }
	if ( tabs.length < 1 ) { return; }
	if ( typeof tabs[0].url !== 'string' ) { return; }

	new QRious({
		background: "white",
		backgroundAlpha: 1.0,
		element: document.getElementById('qr'),
		foreground: "black",
		foregroundAlpha: 1.0,
		level: "L",
		mime: "image/png",
		size: window.innerWidth,
		value: tabs[0].url 
	});


});


