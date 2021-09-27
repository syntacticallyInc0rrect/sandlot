import {memberNicknameMention, SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction, MessageEmbedOptions, Role} from "discord.js";
import {
    initiated,
    pugQueueBotTextChannel,
    queuedUsers,
    updateInitiate,
    updatePugQueueBotMessage,
    updatePugQueueBotTextChannel,
    updatePugQueueCategory,
    updatePugQueueTextChannel,
    updatePugQueueVoiceChannel
} from "../state";
import {ButtonRow, ButtonRowProps} from "../builders/ButtonRow";
import {BotMessageEmbed} from "../builders/BotMessageEmbed";
// import {client} from "../index";

const handleInitiateCommand = async (interaction: CommandInteraction) => {
    if (initiated) {
        await interaction.reply({
            content: "Your bot is already running. If you would like to restart it, " +
                "run the /terminate command and then try the /initiate command again.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        const guild = interaction.guild;
        if (!guild) throw Error("You must run this command inside of a Discord Guild.");
        await guild.channels.create("PICKUP GAMES ", {type: "GUILD_CATEGORY"})
            .then(async category => {
                updatePugQueueCategory(category);
                const everyoneRole: Role | undefined = guild.roles.cache.find(r => r.name === '@everyone');
                if (!everyoneRole) throw Error("This Guild does not contain an @everyone role.");
                await guild.channels.create("pug-bot", {
                    parent: category,
                    type: "GUILD_TEXT",
                    permissionOverwrites: [{
                        id: everyoneRole.id,
                        deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
                        allow: ['VIEW_CHANNEL']
                    }]
                }).then(async bc => {
                    updatePugQueueBotTextChannel(bc);
                    const embedProps: MessageEmbedOptions = {
                        // author: client.user.username,
                        title: "Pickup Game Queue",
                        // thumbnail:,
                        fields: [
                            {
                                name: "Map Pool",
                                value: "Tell West Only!",
                                inline: true
                            },
                            {
                                name: `In Queue - ${queuedUsers.length}/10`,
                                value: queuedUsers.length > 0 ?
                                    queuedUsers.map(qu => memberNicknameMention(qu.id)).toString() :
                                    "Waiting on first player.",
                                inline: false
                            }
                        ],
                        footer: {text: "Be the first to join the queue! Start a revolution!"}
                    };
                    const buttonRowProps: ButtonRowProps[] = [
                        {customId: 'joinQueue', label: 'Join', style: 'SUCCESS', emoji: '➕'},
                        {customId: 'leaveQueue', label: 'Leave', style: 'DANGER', emoji: '➖'},
                        {customId: 'afkImmune', label: 'AFK Immune', style: 'PRIMARY', emoji: '⏳'}
                    ];
                    await pugQueueBotTextChannel.send({
                        content: "Pickup Games Queue",
                        embeds: [BotMessageEmbed(embedProps)],
                        components: [ButtonRow(buttonRowProps)]
                    }).then(m => updatePugQueueBotMessage(m));
                });
                await guild.channels.create("text-chat", {
                    parent: category,
                    type: "GUILD_TEXT"
                }).then(tc => updatePugQueueTextChannel(tc));
                await guild.channels.create("Voice Chat", {
                    parent: category,
                    type: "GUILD_VOICE"
                }).then(vc => updatePugQueueVoiceChannel(vc));
            }).then(async () => {
                await interaction.reply({
                    content: "Your PUG Bot has been initiated!",
                    ephemeral: true,
                    fetchReply: false
                });
                updateInitiate();
            });
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initiate')
        .setDescription('Initiates the PUG Bot'),
    async execute(interaction: CommandInteraction) {
        await handleInitiateCommand(interaction);
    }
};
