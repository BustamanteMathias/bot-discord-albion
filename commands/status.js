const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { pointsData } = require('../utils/fileOperations');

function showStatus(message) {
    const userPoints = pointsData[message.author.id] || { available: 0, used: 0 };
    const embed = new EmbedBuilder()
        .setTitle('**Puntos Obtenidos y Utilizados**')
        .addFields(
            { name: 'Miembro', value: message.member.displayName, inline: false },
            { name: 'Disponibles', value: `${userPoints.available}`, inline: true },
            { name: 'Utilizados', value: `${userPoints.used}`, inline: true },
        )
        .setColor(0x00AE86);

    const button = new ButtonBuilder()
        .setCustomId(`showUserName-${message.author.id}`)
        .setLabel('Ver Historial')
        .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] });
}

module.exports = showStatus;
