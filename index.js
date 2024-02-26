const {Client, IntentsBitField} = require('discord.js');
const axios = require('axios');
const TOKEN = 'MTIwNjc1MjEzOTY1Mzk0NzQwMw.GgV7Fk.JlOBk80LLOUVFsQvCJzZzvoJLV14_LWqb2c9jU';
const PREFIX = '!';
const MOZAMBIQUE_API_KEY  = '7f6a7ee8443864ced36036e755c2819f';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c) =>{
    console.log(`${c.user.tag} is online.`);
});


client.on('messageCreate', async (message) => {
    if(message.author.bot) {return;}
    if (!message.content.startsWith(PREFIX)) return;


    if(message.content === '!hello'){
        message.reply('Hello World!');
    }

    const [command, playerName, platform] = message.content.slice(PREFIX.length).split(' ');

    if(command === 'apexstats'){
        try{
            
            if(!playerName || !platform) {
                message.channel.send('Usage: `!apexstats PLAYER_NAME PLATFORM`');
                return;
            }

            const response = await axios.get(`https://api.mozambiquehe.re/bridge?auth=${MOZAMBIQUE_API_KEY}&player=${playerName}&platform=${platform}`);

            const stats = response.data; // Adjust this based on the API response structure
            console.log('API Response:', response.data);
            const level = stats.global.level;
            const rankName = stats.global.rank.rankName;
            const rankIMG = stats.global.rank.rankImg;


            // Process and send the stats to the Discord channel
            message.reply(`Player: ${playerName}\n Platform: ${platform}\n Level: ${level}\n Rank: ${rankName}\n ${rankIMG}`);
            
        }catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized - Invalid authentication credentials. Check API key and permissions.');
              } else {
                console.error('Error fetching Apex Legends stats:', error.message);
              }
              message.channel.send('Error fetching Apex Legends stats. Please try again later.');
        }
    }

    if(command === 'maprotation'){
        try {
            const response = await axios.get(`https://api.mozambiquehe.re/maprotation?auth=${MOZAMBIQUE_API_KEY}`);
            const stats = response.data; // Adjust this based on the API response structure
            console.log('API Response:', response.data);
            const currMap = stats.current.map;
            const nextMap = stats.next.map
            const remainingTime = stats.current.remainingTimer;
            message.reply(`Current Map: ${currMap}\n Rotating to ${nextMap} in ${remainingTime}`);

            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized - Invalid authentication credentials. Check API key and permissions.');
              } else {
                console.error('Error fetching Map:', error.message);
              }
              message.channel.send('Error fetching Map. Please try again later.');
        }
    }

});

client.login(TOKEN);
