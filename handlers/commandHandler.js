const { prefix } = require('../config'); // Importar el prefijo desde config.js
const commands = require('../commands/commands');

function handleCommand(message) {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands[commandName];

    if (!command) {
        message.channel.send(`El comando \`${commandName}\` no existe.`);
        return;
    }

    command.run(message, args);
}

module.exports = handleCommand;
