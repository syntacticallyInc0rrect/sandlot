import {SlashCommandBuilder} from "@discordjs/builders";
import {
    cancelActivePug,
    CommandDescOption,
    CommandNameOption,
    initiated,
    pugQueueBotMessage,
    queuedUsers,
} from "../state/state";
import {CommandInteraction} from "discord.js";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";

const handleCancelCommand = async (interaction: CommandInteraction) => {
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated PUG Bot to be added to. " +
                "Run the /initiate command if you would like to initiate the PUG Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (queuedUsers.length < 1) {
        await interaction.reply({
            content: "There is no one active PUG to cancel",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        cancelActivePug(0);
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
        .setName(CommandNameOption.cancel)
        .setDescription(CommandDescOption.cancel)
        .setDefaultPermission(false)
        .addIntegerOption(option => option.setName('input')
            .setDescription('The ID for the active PUG to be cancelled')
            .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        await handleCancelCommand(interaction);
    },
};