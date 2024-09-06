const showHelp = require('./help');
const showStatus = require('./status');
const showRanking = require('./ranking');
const updatePoints = require('./updatePoints');
const handleBan = require('./handleBan');
const resetPoints = require('./resetPoints');
const resetAllPoints = require('./resetAllPoints');
const { createParty } = require('./createParty');

module.exports = {
    help: {
        command: 'help',
        description: '[Todos] Muestra la lista de comandos disponibles.\n[Everyone] Displays the list of available commands.',
        run: showHelp,
    },
    status: {
        command: 'status',
        description: '[Miembros] Muestra el estado actual de los puntos de los miembros.\n[Members] Displays the current status of member points.',
        run: showStatus,
    },
    ranking: {
        command: 'ranking',
        description: '[Todos] Muestra el ranking de puntos de todos los miembros.\n[Everyone] Shows the ranking of points for all members.',
        run: showRanking,
    },
    add: {
        command: 'add `puntos` `miembro`',
        description: '[Party Leader] Agrega puntos a un miembro específico.\n[Party Leader] Adds points to a specific member.',
        run: (message, args) => updatePoints(message, args, 'add'),
    },
    res: {
        command: 'res `puntos` `miembro`',
        description: '[Party Leader] Resta puntos a un miembro específico.\n[Party Leader] Subtracts points from a specific member.',
        run: (message, args) => updatePoints(message, args, 'res'),
    },
    ban: {
        command: 'ban `miembro`',
        description: '[Party Leader] Banea a un miembro con una razón especificada.\n[Party Leader] Bans a member with a specified reason.',
        run: (message, args) => handleBan(message, args, 'ban'),
    },
    unban: {
        command: 'unban `miembro`',
        description: '[Party Leader] Desbanea a un miembro previamente baneado.\n[Party Leader] Unbans a previously banned member.',
        run: (message, args) => handleBan(message, args, 'unban'),
    },
    reset: {
        command: 'reset `miembro`',
        description: '[Party Leader] Restablece los puntos de un miembro a cero.\n[Party Leader] Resets the points of a member to zero.',
        run: resetPoints,
    },
    resetfull: {
        command: 'resetfull',
        description: '[Party Leader] Restablece los puntos de todos los miembros a cero.\n[Party Leader] Resets the points of all members to zero.',
        run: resetAllPoints,
    },
    wbparty: {
        command: 'wbparty',
        description: '[Party Leader] Realiza una prueba del sistema de comandos.\n[Party Leader] Conducts a test of the command system.',
        run: createParty,
    },
};
