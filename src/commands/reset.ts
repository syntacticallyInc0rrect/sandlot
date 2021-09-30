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
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated PUG Bot to be added to. " +
                "Run the /initiate command if you would like to initiate the PUG Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (queuedUsers.length < 1) {
        await interaction.reply({
            content: "There is no one in the PUG Queue to remove",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        wipeQueuedUsers();
        await pugQueueBotMessage.edit({
            embeds: [MapPoolEmbed(), QueueEmbed()]
        });
        await interaction.reply({
            content: "The PUG Queue has been reset",
            ephemeral: true,
            fetchReply: false
        });
    }
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
