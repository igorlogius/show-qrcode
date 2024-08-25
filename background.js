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

//types.forEach(function(value, key) {
browser.menus.create({
  id: extname,
  title: extname,
  contexts: ["bookmark", "selection", "link", "image"],
  onclick: function (clickData /*,tab*/) {
    clickDataStore = clickData;

    if (clickData.button === 1 || clickData.modifiers.includes("Ctrl")) {
      browser.windows.create({
        type: "popup",
        url: ["popup.html"],
        width: 500,
        height: 550,
      });
    } else {
      browser.browserAction.setPopup({ popup: "popup.html" });
      browser.browserAction.openPopup();
      browser.browserAction.setPopup({ popup: "" });
    }
  },
});

browser.menus.onShown.addListener(async (info /*, tab*/) => {
  if (info.bookmarkId) {
    let tmp = await browser.bookmarks.get(info.bookmarkId);
    if (tmp.length === 1) {
      tmp = tmp[0];
      if (tmp.url) {
        browser.menus.update(extname, { visible: true });
      } else {
        browser.menus.update(extname, { visible: false });
      }
    } else {
      browser.menus.update(extname, { visible: false });
    }
  } else {
    browser.menus.update(extname, { visible: true });
  }
  browser.menus.refresh();
});

async function onMessage(/*data , sender*/) {
  const tmp = clickDataStore;
  clickDataStore = undefined;
  return Promise.resolve(tmp);
}

browser.runtime.onMessage.addListener(onMessage);

browser.browserAction.onClicked.addListener((tab, info) => {
  if (info.button === 1 || info.modifiers.includes("Ctrl")) {
    browser.windows.create({
      type: "popup",
      url: ["popup.html"],
      width: 500,
      height: 550,
    });
  } else {
    browser.browserAction.setPopup({ popup: "popup.html" });
    browser.browserAction.openPopup();
    browser.browserAction.setPopup({ popup: "" });
  }
});
