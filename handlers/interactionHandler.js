async function handleInteraction(interaction) {
    if (!interaction.isButton()) return;

    const [action, partyId, buttonNumber] = interaction.customId.split('-');

    if (action === 'showUserName' && interaction.user.id === partyId) {
        const { showUserHistory } = require('../utils/logOperations');
        await showUserHistory(interaction, partyId);
    } else if (action === 'partyWbButton') {
        const { updateParty } = require('../commands/createParty');
        await updateParty(interaction, partyId, buttonNumber);
    } else {
        await interaction.reply({ content: 'No puedes interactuar con este botón.', ephemeral: true });
    }
}

module.exports = handleInteraction;
