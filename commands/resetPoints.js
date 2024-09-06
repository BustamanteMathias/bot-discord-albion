const { saveJSON, pointsData } = require('../utils/fileOperations');
const { logCommandUsage } = require('../utils/logOperations');
const { gmRoleName } = require('../config'); 
const hasRole = require('../utils/roleCheck');

function resetPoints(message, args) {
    if (!hasRole(message.member, gmRoleName)) {
        message.channel.send('No tienes permisos para restablecer puntos.');
        return;
    }

    if (args.length < 1) {
        message.channel.send('Por favor, proporciona un usuario. Ejemplo: `.reset username`');
        return;
    }

    const username = args[0];
    const user = message.guild.members.cache.find(member => member.displayName === username);

    if (!user) {
        message.channel.send('Usuario no encontrado.');
        return;
    }

    pointsData[user.id] = { available: 0, used: 0 };
    saveJSON('data/points.json', pointsData);
    logCommandUsage('reset', message.member.displayName, 0, user.id);

    message.channel.send(`Los puntos del usuario ${username} han sido restablecidos a cero.`);
}

module.exports = resetPoints;
