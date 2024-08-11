const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reinvites')
        .setDescription('Releases the reinvites link for everyone to join.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const sessionLink = interaction.options.getString('session-link');

            const embed = new EmbedBuilder()
                .setTitle('GVRR | Reinvites')
                .setDescription(`> <@${interaction.user.id}> has released reinvites for people join, before you join the session make sure you have read the release information rules given by the host.`)
.setColor(`#BD66E8`)
.setFooter({
    text: 'Greenville Roleplay Relevance',
    iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
});

            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('ls');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Release")
                .setDescription(`<@${interaction.user.id}> has released their session, all information has been posted.`)
                .setFooter({
                    text: 'Greenville Roleplay Relevance',
                    iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
                });

            const logChannel = await interaction.client.channels.fetch('1271125552673194126');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '@everyone', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            const filter = i => i.customId === 'ls';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.BUTTON, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();

                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle(`Session Link Button`)
                        .setDescription(`Button clicked by <@${i.user.id}>. for <@${interaction.user.id}> session.`)
                        .setFooter({
                            text: 'Greenville Roleplay Relevance',
                            iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
                        });
                        
                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
