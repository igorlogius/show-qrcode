
browser.tabs.query({active: true, currentWindow: true}).then( (tabs) => {

	//console.log(tabs[0].id, tabs[0].url);
	const tab = tabs[0];
	const url = tab.url;

	 var qr = new QRious({
          element: document.getElementById('qr'),
          size: 200,
	  padding: 10,
          value: url 
        });


} ).catch( (err) => {console.log(err);} );


