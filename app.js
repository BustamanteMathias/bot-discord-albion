const { Client  } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [53608447] });
require('dotenv').config();

const { loadFiles } = require('./utils/fileOperations');
const handleCommand = require('./handlers/commandHandler');
const handleInteraction = require('./handlers/interactionHandler');

loadFiles();

client.on('messageCreate', handleCommand);
client.on('interactionCreate', handleInteraction);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const serverLog = client.guilds.cache.map(guild => {
        return `Server: ${guild.name} (ID: ${guild.id}) - Members: ${guild.memberCount}`;
    }).join('\n');

    console.log('Server locate bot:');
    console.log(serverLog);

    fs.writeFileSync('servidores_log.txt', serverLog, 'utf8');
});

client.login(process.env.TOKEN).catch(err => {
    console.error('Error init:', err);
});