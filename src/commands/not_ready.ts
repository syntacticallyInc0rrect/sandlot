import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {CommandDescOption, CommandNameOption} from "../state";

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.not_ready)
        .setDescription(CommandDescOption.not_ready),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({
            content: 'Not ready, cancel the PUG feature coming soon!',
            ephemeral: true,
            fetchReply: false
        });
    },
};
