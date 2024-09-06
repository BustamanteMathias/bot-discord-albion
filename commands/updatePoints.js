const { saveJSON, pointsData } = require('../utils/fileOperations');
const { logCommandUsage } = require('../utils/logOperations');
const { gmRoleName } = require('../config');
const hasRole = require('../utils/roleCheck');

function updatePoints(message, args, action) {
    if (!hasRole(message.member, gmRoleName)) { 
        message.channel.send('No tienes permisos para usar este comando.');
        return;
    }

    if (args.length < 2) {
        message.channel.send(`Por favor, proporciona un valor y un usuario. Ejemplo: \`.${action} 10 username\``);
        return;
    }

    const value = parseInt(args[0]);
    if (isNaN(value)) {
        message.channel.send('El primer argumento debe ser un número.');
        return;
    }

    const username = args[1];
    const user = message.guild.members.cache.find(member => member.displayName === username);
    if (!user) {
        message.channel.send('Usuario no encontrado.');
        return;
    }

    if (!pointsData[user.id]) pointsData[user.id] = { available: 0, used: 0 };
    pointsData[user.id].available += action === 'add' ? value : -value;
    if (action === 'res') pointsData[user.id].used += value;

    saveJSON('data/points.json', pointsData);
    logCommandUsage(action, message.member.displayName, value, user.id);

    message.channel.send(`Se ha ${action === 'add' ? 'añadido' : 'restado'} ${value} puntos al usuario ${username}.`);
}

module.exports = updatePoints;
