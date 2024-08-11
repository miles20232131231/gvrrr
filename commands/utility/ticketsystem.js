const { Permissions, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Create a ticket'),
    async execute(interaction) {

        await interaction.reply({ content: 'Setting up ticket system...', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('GVRR | Server Support')
            .setDescription(`Select the appropriate option from the dropdown menu to open your ticket, and be patient as our support team might be occupied. Submitting troll tickets will lead to a violation. After opening a ticket, you will receive further instructions.`)
            .setColor(`#BD66E8`)
            .setThumbnail(`https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096`)
            .setFooter({
                text: 'Greenville Roleplay Relevance',
                iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Staff Report',
                    description: 'Report a staff member.',
                    value: 'staff_report',
                },
                {
                    label: 'Civilian Report',
                    description: 'Report a civilian.',
                    value: 'civ_report',
                },
                {
                    label: 'General Support',
                    description: 'Get general support.',
                    value: 'general_support',
                },
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.channel.send({ embeds: [embed], components: [row] });

        await interaction.editReply({ content: 'Ticket system setup complete!', ephemeral: true });
    },
};
