/* global browser */

let clickDataStore;

const types = new Map();
types.set("text","Text or URL");
types.set("mailto","Email Address");
types.set("tel","Phone Number ");
types.set("geo","Geo Location (float,float)");

types.forEach(function(value, key) {
    browser.menus.create({
        id: key
        ,title: value
        ,contexts: ["selection","link","image" ]
        ,onclick: function(clickData/*,tab*/) {
            clickDataStore = clickData;
            if(clickData.menuItemId !== "text"){
                clickDataStore["type"] = key;
            }
            browser.browserAction.openPopup();
        }
    });
});

async function onMessage(/*data , sender*/) {
    const tmp = clickDataStore;
    clickDataStore = undefined;
    return  Promise.resolve(tmp);
}

browser.runtime.onMessage.addListener(onMessage);

