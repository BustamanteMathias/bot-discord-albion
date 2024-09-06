const { registerData, saveJSON } = require('./fileOperations');
const { DateTime } = require('luxon');

function logCommandUsage(command, captainName, pointsChanged, targetUserId) {
    const entry = {
        command,
        captain: captainName,
        targetUserId,
        pointsChanged,
        date: new Date().toISOString(),
    };

    registerData.push(entry);
    saveJSON('data/register.json', registerData);
}

async function showUserHistory(interaction, userId) {
    const fifteenDaysAgo = DateTime.now().minus({ days: 15 });
    const userHistory = registerData
        .filter(entry => entry.targetUserId === userId && DateTime.fromISO(entry.date) > fifteenDaysAgo)
        .map(entry => {
            const localDate = DateTime.fromISO(entry.date).setZone('local').toLocaleString(DateTime.DATETIME_MED);
            return `\`[${entry.command}]\` ${entry.pointsChanged} puntos [${localDate}]`;
        });

    const historyMessage = userHistory.length > 0 ? userHistory.join('\n') : 'No hay registros en los últimos 15 días.';
    await interaction.reply({ content: `Historial de acciones:\n${historyMessage}`, ephemeral: true });
}

module.exports = { logCommandUsage, showUserHistory };
