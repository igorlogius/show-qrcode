
async function init() {

	try {
		// get current activ tab
		const tabs = await browser.tabs.query({active: true, currentWindow: true});

		if (            !Array.isArray(tabs) ) { throw 'tabs query return no array'; }
		if (                 tabs.length < 1 ) { throw 'tabs length is less than 1'  }
		if ( typeof tabs[0].url !== 'string' ) { throw 'tab.url is not a string';    }

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

	}catch(e){
		console.error(e);
	}
}


init();

