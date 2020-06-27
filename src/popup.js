
browser.tabs.query({active: true, currentWindow: true}).then( (tabs) => {

	//console.log(tabs[0].id, tabs[0].url);
	const tab = tabs[0];
	const url = tab.url;

	 var qr = new QRious({
	  background: "white",
	  backgroundAlpha: 1.0,
          element: document.getElementById('qr'),
	  foreground: "black",
	  foregroundAlpha: 1.0,
	  level: "L",
	  mime: "image/png",
	padding: 0,
	  size: 250,
          value: url 
        });


} ).catch( (err) => {console.log(err);} );


