import {bold, codeBlock, SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {
    CommandDescOption,
    CommandNameOption,
    initiated,
    pugAuditTextChannel,
    pugQueueBotTextChannel,
    updateInitiate,
    updatePugAuditTextChannel,
    updatePugQueueBotMessage,
    updatePugQueueBotTextChannel,
    updatePugQueueCategory,
    updatePugQueueTextChannel,
    updatePugQueueVoiceChannel,
    updateSuggestedMap
} from "../state/state";
import {InitialButtonRow} from "../rows/InitialButtonRow";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";
import {GetPugPermissions} from "../helpers/GetPugPermissions";
import {GetAdminPermissions} from "../helpers/GetAdminPermissions";

const createPickupGameChannels = async (interaction: CommandInteraction) => {
    const guild = interaction.guild;
    if (!guild) throw Error("You must run this command inside of a Discord Guild.");
    await guild.channels.create("PICKUP GAMES ", {type: "GUILD_CATEGORY"})
        .then(async category => {
            updatePugQueueCategory(category);
            await guild.channels.create("pug-bot", {
                parent: category,
                type: "GUILD_TEXT",
                permissionOverwrites: GetPugPermissions(guild)
            }).then(async bc => {
                updatePugQueueBotTextChannel(bc);
                updateSuggestedMap();
                await pugQueueBotTextChannel.send({
                    content: bold("/----- 𝙋𝙞𝙘𝙠𝙪𝙥 𝙂𝙖𝙢𝙚𝙨 -----/"),
                    embeds: [MapPoolEmbed(), QueueEmbed()],
                    components: [InitialButtonRow()]
                }).then(m => updatePugQueueBotMessage(m));
            });
            await guild.channels.create("pug-audit-log", {
                parent: category,
                type: "GUILD_TEXT",
                permissionOverwrites: GetAdminPermissions(guild)
            }).then(m => {
                updatePugAuditTextChannel(m);
                pugAuditTextChannel.send({
                    content: codeBlock(`Bot initialized by ${interaction.user.username}`)
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
                content: "Your PUG Bot has been initiated!",
                ephemeral: true,
                fetchReply: false
            });
            updateInitiate();
        });
};

const handleInitiateCommand = async (interaction: CommandInteraction) => {
    if (initiated) await interaction.reply({
        content: "Your bot is already running. If you would like to restart it, " +
            "run the /terminate command and then try the /initiate command again.",
        ephemeral: true,
        fetchReply: false
    });
    else await createPickupGameChannels(interaction);
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.initiate.valueOf())
        .setDescription(CommandDescOption.initiate.valueOf())
        .setDefaultPermission(false),
    async execute(interaction: CommandInteraction) {
        await handleInitiateCommand(interaction).catch(e => console.log(e));
    }
};
