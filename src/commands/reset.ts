import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import {
    CommandDescOption,
    CommandNameOption,
    initiated,
    pugQueueBotMessage,
    queuedUsers,
    wipeQueuedUsers
} from "../state/state";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";

const handleResetCommand = async (interaction: CommandInteraction) => {
    const replyContent: string = (!initiated) ?
        "There is no initiated Pickup Game Bot to be added to. " +
        "Run the /initiate command if you would like to initiate the Pickup Game Bot." :
        (queuedUsers.length < 1) ?
            "There is no one in the Pickup Game Queue to remove" :
            "The Pickup Game Queue has been reset";
    if (initiated && queuedUsers.length > 0) {
        wipeQueuedUsers();
        await pugQueueBotMessage.edit({
            embeds: [MapPoolEmbed(), QueueEmbed()]
        });
    }
    await interaction.reply({
        content: replyContent,
        ephemeral: true,
        fetchReply: false
    });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.reset)
        .setDescription(CommandDescOption.reset)
        .setDefaultPermission(false),
    async execute(interaction: CommandInteraction) {
        await handleResetCommand(interaction);
    },
};
