
(async function () {

	try {
		// get current activ tab
		const tabs = await browser.tabs.query({active: true, currentWindow: true});

		if (            !Array.isArray(tabs) ) { throw 'tabs query return no array'; }
		if (                 tabs.length < 1 ) { throw 'tabs length is less than 1'  }
		if ( typeof tabs[0].url !== 'string' ) { throw 'tab.url is not a string';    }

		const qr = new QRious({
			background: "white",
			backgroundAlpha: 0.0, // make background transparent
			foreground: "black",
			foregroundAlpha: 1.0,
			level: "L", // large
			mime: "image/png", // portable network graphics 
			size: 940, // max size is size of the window width
			value: tabs[0].url 
		});

		const dataurl =qr.toDataURL('image/png');
		qrimg = document.getElementById('qrimg')
		qrimg.src=dataurl;
		qrlink = document.getElementById('qrlink')
		qrlink.download= "qr_" + encodeURIComponent(tabs[0].url) + ".png"
		qrlink.href=dataurl;

	}catch(e){
		console.error(e);
	}
}());


