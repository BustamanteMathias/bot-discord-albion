const { saveJSON, pointsData } = require('../utils/fileOperations');
const { logCommandUsage } = require('../utils/logOperations');
const { gmRoleName } = require('../config');
const hasRole = require('../utils/roleCheck');

function resetAllPoints(message) {
    if (!hasRole(message.member, gmRoleName)) { 
        message.channel.send('No tienes permisos para restablecer los puntos de todos los miembros.');
        return;
    }

    for (const userId in pointsData) {
        pointsData[userId] = { available: 0, used: 0 };
    }

    saveJSON('data/points.json', pointsData);
    logCommandUsage('resetAll', message.member.displayName, 0, 'all');

    message.channel.send('Los puntos de todos los miembros han sido restablecidos a cero.');
}

module.exports = resetAllPoints;
