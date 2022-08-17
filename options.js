/* global browser */

function onChange(evt) {

	let id = evt.target.id;
	let el = document.getElementById(id);

	let value = ( (el.type === 'checkbox') ? el.checked : el.value)
	let obj = {}

	//console.log(id,value, el.type,el.min);
	if(value === ""){
		return;
	}
	if(el.type === 'number'){
		try {
			value = parseInt(value);
			if(isNaN(value)){
				value = el.min;
			}
			if(value < el.min) {
				value = el.min;
			}
		}catch(e){
			value = el.min
		}
	}

	obj[id] = value;

	//console.log(id,value);
	browser.storage.local.set(obj).catch(console.error);

}

[ "saveMode", "qrPadding", "qrSize", "qrecl", "bgcolor","fgcolor", "bgalpha","fgalpha" ].map( (id) => {

	browser.storage.local.get(id).then( (obj) => {

		let el = document.getElementById(id);
		let val = obj[id];

        //console.log(id, val);

		if(typeof val !== 'undefined') {
			if(el.type === 'checkbox') {
				el.checked = val;
			}
			else{
				el.value = val;
			}
		}

	}).catch(console.error);

	let el = document.getElementById(id);
	el.addEventListener('input', onChange);
});

