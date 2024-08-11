const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Purges messages from today between specified start and end times, excluding the first 2 messages.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1); 
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            const messagesToDelete = sortedMessages.filter((msg, index) => {
                const msgDate = new Date(msg.createdTimestamp);
                return index >= 2 && msgDate >= start && msgDate <= end;
            });

            for (const msg of messagesToDelete.values()) {
                await msg.delete();
            }

            const embed = new EmbedBuilder()
                .setTitle('GVRR | Session Over')
                .setDescription(`Thank you for joining the Greenville Roleplay Relevance session! We hope you had an enjoyable experience throughout the session.
                
                **__Session Details:__**
                
                Session Host: **<@${interaction.user.id}>**
                Start Time: **${startTime}** 
                End Time: **${endTime}** 
                `)
                .setColor(`#BD66E8`)
                .setFooter({
                    text: 'Greenville Roleplay Relevance',
                    iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
                });

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Over")
                .setDescription(`<@${interaction.user.id}> has ended their session.`)
                .setColor(`#BD66E8`)
                .setFooter({
                    text: 'Greenville Roleplay Relevance',
                    iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
                });
    
            const targetChannel = await interaction.client.channels.fetch('1271125552673194126');
            
            if (!targetChannel) {
                throw new Error('Target channel not found or accessible.');
            }

            await targetChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Command sent below.', ephemeral: true });
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = 'Failed to delete messages. Please try again later.';
            
            if (error.code === 50001) {
                errorMessage = 'The bot is missing access to the target channel.';
            }
            
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    },
};
