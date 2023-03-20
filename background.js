/* global browser */

let clickDataStore;

const manifest = browser.runtime.getManifest();
const extname = manifest.name;

/*
const types = new Map();
types.set("text","Text or URL");
types.set("mailto","Email Address");
types.set("tel","Phone Number ");
types.set("geo","Geo Location (float,float)");
*/

function onCreated() {
  if (browser.runtime.lastError) {
    console.error("error creating item:", browser.runtime.lastError);
  } else {
    console.debug("item created successfully");
  }
}


//types.forEach(function(value, key) {
    browser.menus.create({
         id: extname
        ,title: extname
        ,contexts: ["bookmark", "selection","link","image" ]
        ,onclick: function(clickData/*,tab*/) {
            clickDataStore = clickData;
            /*if(clickData.menuItemId !== "text"){
                clickDataStore["type"] = key;
            }*/
            browser.browserAction.openPopup();
        }
    }, onCreated);
//});
//

browser.menus.onShown.addListener(async (info, tab) => {
		browser.menus.update(extname, { visible: true });
	if(info.bookmarkId){
		tmp = await browser.bookmarks.get(info.bookmarkId);
		if(tmp.length === 1){
			tmp = tmp[0];
			if(tmp.url){
				return;
			}
		}
		browser.menus.update(extname, { visible: false });
		// Note: Not waiting for returned promise.
	}
	browser.menus.refresh();
});


async function onMessage(/*data , sender*/) {
    const tmp = clickDataStore;
    clickDataStore = undefined;
    return  Promise.resolve(tmp);
}

browser.runtime.onMessage.addListener(onMessage);

