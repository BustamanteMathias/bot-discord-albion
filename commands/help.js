const { EmbedBuilder } = require('discord.js');

const commands = {
    help: {
        command: 'help',
        description: '[Todos] Muestra la lista de comandos disponibles.\n[Everyone] Displays the list of available commands.',
    },
    status: {
        command: 'status',
        description: '[Miembros] Muestra el estado actual de los puntos de los miembros.\n[Members] Displays the current status of member points.',
    },
    ranking: {
        command: 'ranking',
        description: '[Todos] Muestra el ranking de puntos de todos los miembros.\n[Everyone] Shows the ranking of points for all members.',
    },
    add: {
        command: 'add `puntos` `miembro`',
        description: '[Party Leader] Agrega puntos a un miembro específico.\n[Party Leader] Adds points to a specific member.',
    },
    res: {
        command: 'res `puntos` `miembro`',
        description: '[Party Leader] Resta puntos a un miembro específico.\n[Party Leader] Subtracts points from a specific member.',
    },
    ban: {
        command: 'ban `miembro`',
        description: '[Party Leader] Banea a un miembro con una razón especificada.\n[Party Leader] Bans a member with a specified reason.',
    },
    unban: {
        command: 'unban `miembro`',
        description: '[Party Leader] Desbanea a un miembro previamente baneado.\n[Party Leader] Unbans a previously banned member.',
    },
    reset: {
        command: 'reset `miembro`',
        description: '[Party Leader] Restablece los puntos de un miembro a cero.\n[Party Leader] Resets the points of a member to zero.',
    },
    resetfull: {
        command: 'resetfull',
        description: '[Party Leader] Restablece los puntos de todos los miembros a cero.\n[Party Leader] Resets the points of all members to zero.',
    },
    wbparty: {
        command: 'wbparty',
        description: '[Party Leader] Realiza una prueba del sistema de comandos.\n[Party Leader] Conducts a test of the command system.',
    },
};

function showHelp(message) {
    const embed = new EmbedBuilder()
        .setTitle('Lista de Comandos Disponibles')
        .setColor(0x3498DB)
        .setDescription('Todos los comandos disponibles con sus descripciones:');

    let fieldCount = 0;
    let embeds = [embed]; // Array para manejar múltiples embeds si se supera el límite y que no rompa las pelotas

    Object.values(commands).forEach(cmd => {
        const commandName = cmd.command || 'Comando desconocido';
        const commandDescription = cmd.description || 'Descripción no disponible';

        if (fieldCount < 25) {
            // Agrega el campo si no se ha alcanzado el límite
            embeds[embeds.length - 1].addFields({ name: `.${commandName}`, value: commandDescription, inline: false });
            fieldCount++;
        } else {
            // Si se ha alcanzado el límite de campos, crea un nuevo embeeed
            const newEmbed = new EmbedBuilder()
                .setTitle('Lista de Comandos Disponibles (continuación)')
                .setColor(0x3498DB);

            newEmbed.addFields({ name: `.${commandName}`, value: commandDescription, inline: false });
            embeds.push(newEmbed); 
            fieldCount = 1; 
        }
    });

    embeds.forEach(embed => message.channel.send({ embeds: [embed] }));
}

module.exports = showHelp;
