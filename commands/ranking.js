const { EmbedBuilder } = require('discord.js');
const { pointsData } = require('../utils/fileOperations');

function showRanking(message) {
    const ranking = Object.entries(pointsData)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.available - a.available)
        .slice(0, 10);

    if (ranking.length === 0) {
        message.channel.send('No hay puntos registrados.');
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle('Ranking de Puntos')
        .setColor(0xF1C40F);

    ranking.forEach((user, index) => {
        const member = message.guild.members.cache.get(user.id);
        const username = member ? member.displayName : 'Usuario no encontrado';
        embed.addFields({ name: `${index + 1}. ${username}`, value: `Puntos Disponibles: ${user.available}`, inline: false });
    });

    message.channel.send({ embeds: [embed] });
}

module.exports = showRanking;
