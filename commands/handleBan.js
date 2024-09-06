const hasRole = require('../utils/roleCheck');
const { gmRoleName } = require('../config'); 
const { logCommandUsage } = require('../utils/logOperations');

async function handleBan(message, args, action) {
    if (!hasRole(message.member, gmRoleName)) { 
        message.channel.send(`No tienes permisos para ${action === 'ban' ? 'banear' : 'desbanear'} miembros.`);
        return;
    }

    if (args.length < 1) {
        message.channel.send(`Por favor, proporciona un usuario. Ejemplo: \`.${action} username\``);
        return;
    }

    const username = args[0];
    const user = message.guild.members.cache.find(member => member.displayName === username);

    if (!user) {
        message.channel.send('Usuario no encontrado.');
        return;
    }

    try {
        logCommandUsage(action, message.member.displayName, 0, user.id);
        message.channel.send(`Usuario: ${username} ha sido ${action === 'ban' ? 'baneado' : 'desbaneado'}.`);
    } catch (error) {
        message.channel.send(`No se pudo ${action === 'ban' ? 'banear' : 'desbanear'} al usuario: ${error.message}`);
    }
}

module.exports = handleBan;
