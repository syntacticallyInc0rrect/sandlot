import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction, MessageActionRow, MessageButton, Role} from "discord.js";
import {
    initialized, pugQueueBotTextChannel,
    updateInitialized,
    updatePugQueueBotTextChannel,
    updatePugQueueCategory,
    updatePugQueueTextChannel,
    updatePugQueueVoiceChannel
} from "../state";
import {ButtonRow} from "../builders/buttonRow";

const handleInitializeCommand = async (interaction: CommandInteraction) => {
    if (initialized) {
        await interaction.reply({
            content: "Your bot is already initialized. If you would like to re-initialize it, " +
                "run the /terminate command and then try the /initialize command again.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        const guild = interaction.guild;
        if (!guild) throw Error("You must run this command inside of a Discord Guild.");
        await interaction.guild.channels.create("PICKUP GAMES ", {type: "GUILD_CATEGORY"})
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
                    const buttonRow = await ButtonRow();
                    await pugQueueBotTextChannel.send({
                        content: "Pickup Game Queue",
                        components: [buttonRow]
                    });
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
                    content: "Pug Queue Bot Initiated!",
                    ephemeral: true,
                    fetchReply: false
                });
                updateInitialized();
            });
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initialize')
        .setDescription('Initializes the PUG Bot'),
    async execute(interaction: CommandInteraction) {
        await handleInitializeCommand(interaction);
    }
};
