const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, channelMention, channelLink} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('GVRR | Session Startup')
            .setDescription(` <@${interaction.user.id}> started a session! Are you guys ready to start the session? Please make sure you follow all information provided by the host, failing to do so would result in a server strike.
                
                > Make sure you have ready all the information provided in the channel and the information channel.
                
                > Failing to follow the banned vehicle list would result in a warning, driving a banned vehicle car again would result for a session kick.
                
                For the session to start this message needs **${reactions}+**`)
            .setColor(`#BD66E8`)
            .setFooter({
                text: 'Greenville Roleplay Relevance',
                iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
            });

        const message = await interaction.channel.send({
            content: '@everyone',
            embeds: [embed]
        });

        await message.react('✅');

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Startup")
            .setDescription(`<@${interaction.user.id}> has started up a session. The reactions has been set to ${reactions} and all information is posted on the embed message.`)
            .setFooter({
                text: 'Greenville Roleplay Relevance',
                iconURL: 'https://cdn.discordapp.com/icons/1270640345780195369/f5ab2a8085a2c05d299b7abb1c4dbba2.png?size=4096'
            });

        const targetChannel = await interaction.client.channels.fetch('1271125552673194126');
        await targetChannel.send({ embeds: [newEmbed] });

        const filter = (reaction, user) => reaction.emoji.name === '✅';

        const collector = message.createReactionCollector({ filter, time: 86400000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.count} reactions`);
            if (reaction.count >= reactions) {
                const settingUpEmbed = new EmbedBuilder()
                    .setDescription('Setting up!')
                    .setFooter({
                        text: 'Greenville Roleplay Phase',
                        iconURL: 'https://cdn.discordapp.com/icons/980909397461065848/869f511ea9b177b668fba278eef40e5e.png?size=4096'
                    });

                interaction.channel.send({ embeds: [settingUpEmbed] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            console.log(`Collector ended. Total reactions: ${collected.size}`);
        });

        await interaction.reply({ content: `Message has been sent below.`, ephemeral: true });
    },
};
