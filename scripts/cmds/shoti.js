const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "shoti", // add cmd name
    aliases: ["wifey"], // add aliases ['aliases'] if needed

    
    author: "Vex_Kshitiz",// dont change this saar

    
    version: "1.0",
    cooldowns: 10,
    role: 0,
    shortDescription: "",
    longDescription: "Get random tiktok video from specific users",
    category: "fun",
    guide: "{p}shoti",
  },

  onStart: async function ({ api, event, message }) {
    function getRandomUsername() {

      const usernames = ['_nikita_khadkaaa', 'romaarif21', 'leighdevera_', 'babeenachamlingrai', 'sanymaaa', 'yashinaa_', 'moli0n', 'yuc___',  'study__materrial', 'belinatimilsina6', 'molmol15925', 'hninpyaepyaeli396', 'mama_diorr']; 
      
      const randomIndex = Math.floor(Math.random() * usernames.length);
      return usernames[randomIndex];
    }

    api.setMessageReaction("😎", event.messageID, (err) => {}, true);

    try {
      const username = getRandomUsername();
      const response = await axios.get(`https://tuktuk-scrap.onrender.com/kshitiz?username=${username}`);
      const user = response.data.user || "@user_unknown";
      const postData = response.data.posts;
      const selectedUrl = getRandomUrl(postData);

      const videoResponse = await axios.get(selectedUrl, { responseType: "stream" });

      const tempVideoPath = path.join(__dirname, "cache", `tuktuk.mp4`);
      const writer = fs.createWriteStream(tempVideoPath);
      videoResponse.data.pipe(writer);

      writer.on("finish", async () => {
        const stream = fs.createReadStream(tempVideoPath);
        await message.reply({
          body: ``,
          attachment: stream,
        });
        api.setMessageReaction("😘", event.messageID, (err) => {}, true);
        fs.unlink(tempVideoPath, (err) => {
          if (err) console.error(err);
          console.log(`Deleted`);
        });
      });
    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred.");
    }
  }
};

let usedUrls = [];

function getRandomUrl(postData) {
  if (usedUrls.length === postData.length) {
    usedUrls = [];
  }

  let randomIndex;
  let selectedPost;
  do {
    randomIndex = Math.floor(Math.random() * postData.length);
    selectedPost = postData[randomIndex].replace(/\\/g, "/");
  } while (usedUrls.includes(selectedPost));

  usedUrls.push(selectedPost);
  return selectedPost;
}
