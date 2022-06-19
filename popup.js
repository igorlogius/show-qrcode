/* global browser QRious */
/*
function dataURItoBlob(dataURI) {
*/
function dataURItoArrayBuffer(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  //const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  let ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  let ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return ab;

  // write ArrayBuffer to a blob
  //var blob = new Blob([ab], {type: mimeString});
  //return blob;
}
/**/


    async function getFromStorage(type, id, fallback) {
		let tmp = await browser.storage.local.get(id);
		return (typeof tmp[id] === type) ? tmp[id] : fallback;
	}

(async function () {


	try {
		// get current activ tab
		const tabs = await browser.tabs.query({active: true, currentWindow: true});

		if (            !Array.isArray(tabs) ) { throw 'tabs query return no array'; }
		if (                 tabs.length < 1 ) { throw 'tabs length is less than 1'; }
		if ( typeof tabs[0].url !== 'string' ) { throw 'tab.url is not a string';    }

        const bgcolor = await getFromStorage('string','bgcolor','#ffffff');
        const bgalpha = await getFromStorage('string','bgalpha',0.0);

        const fgcolor = await getFromStorage('string','fgcolor','#000000');
        const fgalpha = await getFromStorage('string','fgalpha',1.0);

		const qr = new QRious({
			background: bgcolor,
			backgroundAlpha: bgalpha,
			foreground: fgcolor,
			foregroundAlpha: fgalpha,
			level: "L", // large
			mime: "image/png", // portable network graphics
			size: 940, // max size is size of the window width
			value: tabs[0].url
		});

		const datauri =qr.toDataURL('image/png');
		let qrimg = document.getElementById('qrimg');
		qrimg.src=datauri;

		let qrsave = document.getElementById('qrsave');
		qrsave.download= "qr_" + encodeURIComponent(tabs[0].url) + ".png";
		qrsave.href=datauri;

		browser.permissions.contains({
			permissions: [ "clipboardWrite" ]
		}).then( function(result) {
			if(result) {
				const qrcopy = document.getElementById('qrcopy');
				qrcopy.querySelector('button').disabled=false;
				qrcopy.querySelector('button').title="Copy to Clipboard";
				qrcopy.onclick = async function(/*evt*/){
					qrimg.style.display = 'none';
					const qrArrayBuffer = dataURItoArrayBuffer(datauri);
					await browser.clipboard.setImageData(qrArrayBuffer, 'png');
					setTimeout(function(){
						qrimg.style.display = 'block';
					},150);
				}
			}
		});

	}catch(e){
		console.error(e);
	}
}());


