## yugioh-card-downloader

Simple node.js script to download yugioh card artworks from the ygoprodeck api

### How to use

- Clone repo
- cd into yugioh-card-downloader
- Run npm install
- update cardList.json with strings of yugioh card IDs (remove leading zeros)
- Run npm start

### How it works

It will download a .jpg file to the /downloads directory for every ID string of cardList.json
Downloaded IDs will be recorded in downloaded.json
