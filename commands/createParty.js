const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { saveJSON, parties } = require('../utils/fileOperations');
const { gmRoleName, channels_build_wb } = require('../config');
const hasRole = require('../utils/roleCheck');
const fs = require('fs');

// Cargar puntos desde el archivo JSON
function loadPoints() {
    const data = fs.readFileSync('data/points.json', 'utf8');
    return JSON.parse(data);
}

function createParty(message, args) {
    if (!hasRole(message.member, gmRoleName)) { 
        message.channel.send('No tienes permisos para usar este comando.');
        return;
    }

    if (args.length < 2) {
        message.channel.send('Por favor, proporciona comidas y hora de inicio UTC (in-game). Ejemplo: `!partywb 5 1915`');
        return;
    }

    const partyId = Date.now().toString(); // Genera un ID único basado en el tiempo actual
    parties[partyId] = { 
        id: partyId,
        lider: message.member.displayName,
        time: `${args[1].slice(0, 2)}:${args[1].slice(2)} UTC`,
        food: args[0],
        status: 'Open',
        members: Array.from({ length: 8 }, () => ['\n']),
    };

    const embed = createPartyEmbed(parties[partyId]);
    const rows = createPartyButtons(parties[partyId]);

    message.channel.send({ embeds: [embed], components: rows });
}

function createPartyEmbed(party) {
    const b = channels_build_wb;
    const literal_rol = ['Off Tank', 'Main Heal', 'Party Heal', 'DPS', 'Shadowcaller', 'Blazing', 'Mount', 'Scout']
    const channels = [b.c_offtank, b.c_mainheal, b.c_partyheal, b.c_dps, b.c_shadow, b.c_blazing, b.c_mount, b.c_scout]

    return new EmbedBuilder()
        .setTitle(`PARTY ID: ${party.id}`)
        .addFields(
            { name: 'Init', value: `${party.time}`, inline: true },
            { name: 'Food', value: `${party.food}`, inline: true },
            { name: 'Status', value: `:green_circle: ${party.status}`, inline: true },
            { name: '**Main Tank**', value: `${party.lider} (${b.c_maintank})\n`, inline: false },
            ...party.members.map((member, index) => ({
                name: `\`${index + 1}\` ${literal_rol[index]} (${member.length - 1})\n${channels[index]}`,
                value: member.join('\n'),
                inline: true,
            }))
        )
        .setDescription(`Elige tu rol. Presiona de nuevo para anular la selección.\nChannel Rules: ${b.c_rules}\n`)
        .setColor(0x00AE86);
}

function createPartyButtons(party) {
    const buttons = Array.from({ length: 8 }, (_, i) => new ButtonBuilder()
        .setCustomId(`partyWbButton-${party.id}-${i + 1}`)
        .setLabel(`${i + 1}`)
        .setStyle(ButtonStyle.Primary));

    buttons.push(new ButtonBuilder()
        .setCustomId(`partyWbButton-${party.id}-9`)
        .setLabel('Closed Party')
        .setStyle(ButtonStyle.Danger));

    const rows = [];
    for (let i = 0; i < buttons.length; i += 4) {
        rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 4)));
    }
    return rows;
}

async function updateParty(interaction, partyId, buttonNumber) {
    const party = parties[partyId];
    if (!party) {
        await interaction.reply({ content: 'Party no encontrada.', ephemeral: true });
        return;
    }

    const b = channels_build_wb;
    const points = loadPoints();
    const memberId = interaction.member.id;
    const memberDisplayName = interaction.member.displayName;
    const memberPoints = points[memberId]?.available || 0;
    const memberNameWithPoints = `${memberDisplayName} (${memberPoints})`;

    let iconStatus = ':green_circle:'; 

    // Si el botón de cerrar party fue presionado y el usuario es el líder
    if (buttonNumber === '9') {
        if (interaction.member.displayName !== party.lider) {
            await interaction.reply({ content: 'Solo el líder de la party puede cerrarla.', ephemeral: true });
            return;
        } else {
            party.status = 'Closed'; 
            iconStatus = ':red_circle:';
        }
    }

    // Lógica para agregar o quitar al miembro de la lista
    if (interaction.member.displayName !== party.lider && party.status === 'Open' && buttonNumber !== '9') {
        const roleIndex = buttonNumber - 1;
        const roleMembers = party.members[roleIndex];
        const memberIndex = roleMembers.indexOf(memberNameWithPoints);

        if (memberIndex !== -1) {
            // Si el miembro ya está en la lista, se quita
            roleMembers.splice(memberIndex, 1);
        } else {
            // Si no está en la lista, se agrega
            roleMembers.push(memberNameWithPoints);
        }
    }

    // Actualiza el embed con el nuevo estado de la party
    const literal_rol = ['Off Tank', 'Main Heal', 'Party Heal', 'DPS', 'Shadowcaller', 'Blazing', 'Mount', 'Scout']
    const channels = [b.c_offtank, b.c_mainheal, b.c_partyheal, b.c_dps, b.c_shadow, b.c_blazing, b.c_mount, b.c_scout]

    const updatedEmbed = new EmbedBuilder()
        .setTitle(`PARTY ID: ${party.id}`)
        .addFields(
            { name: 'Init', value: `${party.time}`, inline: true },
            { name: 'Food', value: `${party.food}`, inline: true },
            { name: 'Status', value: `${iconStatus} ${party.status}`, inline: true },
            { name: '**Main Tank**', value: `${party.lider} (${b.c_maintank})\n`, inline: false },
            ...party.members.map((member, index) => ({
                name: `\`${index + 1}\` ${literal_rol[index]} (${member.length - 1})\n${channels[index]}`,
                value: member.join('\n'),
                inline: true,
            }))
        )
        .setDescription(`Elige tu rol. Presiona de nuevo para anular la selección.\nChannel Rules: ${b.c_rules}\n`)
        .setColor(0x00AE86);

    // Si la party no está cerrada, crea los botones. Si está cerrada, a la mierda los botones.
    const rows = party.status !== 'Closed' ? createPartyButtons(party) : [];

    await interaction.update({ embeds: [updatedEmbed], components: rows });
}

module.exports = { createParty, updateParty };
