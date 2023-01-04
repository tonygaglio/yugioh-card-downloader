const fs = require("fs");
const download = require("image-downloader");

const CARDLIST = require("./cardList.json");
const DOWNLOADED = require("./downloaded.json");
const DELAY = 500;
const count = {
  skip: 0,
  newDownloaded: 0,
  errors: 0,
  errorCards: [],
};

const strIndex = (number) => {
  let newStr = `${number}`;
  while (newStr.length < 4) {
    newStr = `0${newStr}`;
  }
  return newStr;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const fetchImage = async (mediaURL, filepath) => {
  let error = false;
  console.log("\tDownloading!");

  async function downloadImage(url, dest) {
    await download.image({
      url,
      dest,
    });
  }

  try {
    await downloadImage(mediaURL, filepath);
  } catch (err) {
    count.errors++;
    error = true;
  }

  if (error) {
    throw new Error("Error while downloading!");
  }
};

async function writeDownloadedToFile() {
  console.log("\tWriting downloaded.json...");
  try {
    count.newDownloaded++;
    await sleep(DELAY);
    await fs.promises.writeFile(
      "./downloaded.json",
      JSON.stringify(DOWNLOADED, null, 2)
    );
  } catch (err) {
    throw new Error(err);
  }
}

const getImageURL = (id) => {
  return `https://images.ygoprodeck.com/images/cards_cropped/${id}.jpg`;
};

async function handleCard(i) {
  const card = CARDLIST[i];
  if (!card) {
    return console.log("CARD ID MISSING!!!!");
  }
  const format = ".jpg";
  const dir = "downloads";
  const filename = card + "." + format;

  const index = `[${strIndex(i + 1)}]`;
  const url = getImageURL(card);

  // Check if already downloaded
  if (DOWNLOADED.includes(card)) {
    console.log(index, " Already downloaded. \tSkipped");
    count.skip++;
    return;
  }

  console.log(`\n${index}  Found card: \t\t FILE: ${filename}`);

  // Download file
  console.log(index, ` Attempting download: \t${card}`);
  try {
    await fetchImage(url, `../../downloads`);
  } catch (err) {
    console.log("Error downloading card: ", card);
    count.errorCards.push(card);
    //count.errors++;
    return;
  }
  console.log(index, ` Success! Downloaded: \t${card}`);

  // Save id to downloaded.json
  console.log(index, ` Attempting write to downloaded.json!`);
  DOWNLOADED.push(card);
  await writeDownloadedToFile();

  console.log(index, ` Successful write to downloaded.json!`);
}

async function startDownloads() {
  let cardNum = 0;
  try {
    for (cardNum = 0; cardNum < CARDLIST.length; cardNum++) {
      await handleCard(cardNum);
    }

    printResults();
  } catch (err) {
    console.log(
      "Error during operation. card: ",
      cardNum,
      " id: ",
      CARDLIST[cardNum]
    );
    printResults();

    console.log(err);
  }
}

const printResults = () => {
  console.log(`\n\nOperation complete. \n
Skipped: ${count.skip}
New Downloaded: ${count.newDownloaded}
Total Downloads: ${DOWNLOADED.length}

Errors: ${count.errors}
`);
  console.log("Error cards: ");
  console.log(count.errorCards.join("\n"));
};

console.clear();
startDownloads();
