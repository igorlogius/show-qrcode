/* global browser QRCode */


async function getFromStorage(type, id, fallback) {
    let tmp = await browser.storage.local.get(id);
    return (typeof tmp[id] === type) ? tmp[id] : fallback;
}

async function updateQRCode() {

    const qrtext= document.getElementById('qrtext');
    let fgcolor = await getFromStorage('string','fgcolor','#000000');
    const fgalpha = parseInt(await getFromStorage('string','fgalpha',"255"));
    let bgcolor = await getFromStorage('string','bgcolor','#ffffff');
    const bgalpha = parseInt(await getFromStorage('string','bgalpha',"0"));
    const qrSize = await getFromStorage('number','qrSize', 460);
    const qrPadding= await getFromStorage('number','qrPadding', 1);
    const qrecl = await getFromStorage('string','qrecl', 'M');
    const mode = await getFromStorage('string','saveMode', 'png');

    const body = document.body,html = document.documentElement;
    const w = Math.max( body.scrollWidth, body.offsetWidth,  html.clientWidth, html.scrollWidth, html.offsetWidth );

    fgcolor = fgcolor + fgalpha.toString(16);
    bgcolor = bgcolor + bgalpha.toString(16);

    if(fgcolor.length < 9){
        fgcolor = fgcolor + "0";
    }
    if(bgcolor.length < 9){
        bgcolor = bgcolor + "0";
    }

    const qrcode = new QRCode({
          content:  qrtext.value,
          padding: qrPadding,
          width: w-w/4,
          height: w-w/4,
          color: fgcolor ,
          background: bgcolor,
          ecl: qrecl,
    });
    const svg = qrcode.svg();

    const qrsvg = document.getElementById("qrsvg");
    qrsvg.innerHTML = svg;
    //qrsvg.insertAdjacentHTML('beforeend', svg);

    const svgImage = document.createElement('img');
    svgImage.onload = (() => {
        const canvas = document.createElement('canvas');
        canvas.width = qrSize;
        canvas.height = qrSize;
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0, qrSize, qrSize);
        const qrimg = document.getElementById('qrimg');
        qrimg.filename = qrtext.value+ "."+mode;
        qrimg.src = canvas.toDataURL('image/png');
        URL.revokeObjectURL(svgImage.src);
        canvas.remove();
        svgImage.remove();
    });
    svgImage.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));

}

// register listeners
document.getElementById('qrtext').addEventListener('input', updateQRCode, false);
document.getElementById('qrsave').addEventListener('click', async function(){

    const mode = await getFromStorage('string','saveMode', 'png');
    let a = document.createElement('a');
    const qrimg = document.getElementById('qrimg');
    a.download = qrimg.filename;

    if(mode === 'png'){
        a.href = qrimg.src;
        a.click();
    }else if(mode === 'svg'){
        const qrsvg = document.getElementById("qrsvg");
        a.href = URL.createObjectURL(new Blob([qrsvg.innerHTML], { type: 'image/svg+xml' }));
        a.click();
        URL.revokeObjectURL(a.href);
    }
    a.remove();
}, false);
document.getElementById('qrcopy').addEventListener('click', function(){
    const qrimg = document.getElementById('qrimg');
    //qrimg.focus();
    qrimg.contentEditable = 'true'
    document.getSelection().removeAllRanges();
    let range = document.createRange();
    range.selectNode(qrimg);
    document.getSelection().addRange(range);
    document.execCommand("copy");
    qrimg.contentEditable = 'false';
}, false);

document.getElementById('qroptions').addEventListener('click', function(){
    window.open('options.html', "_blank", "popup");
}, false);

async function onLoad() {

    const m = await browser.runtime.sendMessage({});
    let value = '';
    if ( typeof m === 'object') {
        //  1. text, 2. linkUrl (a) , 3. srcUrl (img)
        for(let b of ['selectionText', 'linkUrl', 'srcUrl' ]){
            if(typeof m[b] === 'string' && m[b].trim() !== ''){
                value = m[b].trim();
                if(b === 'selectionText' && m.type){
                    value = m.type + ":" + value;
                }
                break;
            }
        }
    }

    if(value === ''){
        const tabs = await browser.tabs.query({active: true, currentWindow: true});
        value = tabs[0].url;
    }

    const qrtext = document.getElementById('qrtext');
    qrtext.value = value;
    updateQRCode();

}

document.addEventListener('DOMContentLoaded', onLoad);

