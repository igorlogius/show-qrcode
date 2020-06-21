# addr2qr a firefox/chrome webextension add-on

## Details:
https://addons.mozilla.org/en-US/firefox/addon/addr2qr/

## Usage:  
```
wget https://github.com/igorlogius/tbl2csv/archive/master.zip
unzip master.zip
zip -j "addr2qr-$(grep '"version"' addr2qr-master/src/manifest.json  | cut -d'"' -f4).xpi" ./addr2qr-master/src/*
```
Import addr2qr-x.y.z.zip into your browser (e.g. via `about:debugging`)
