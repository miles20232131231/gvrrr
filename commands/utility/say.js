const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sends a message by the bot')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Type a message')
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        await interaction.reply({ content: `Sending message: ${message}`, ephemeral: true });

        
        await interaction.channel.send({ content: message });
    },
};
