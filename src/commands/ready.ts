import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {CommandDescOption, CommandNameOption} from "../state";

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.ready)
        .setDescription(CommandDescOption.ready),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({
            content: 'Ready feature coming soon!',
            ephemeral: true,
            fetchReply: false
        });
    },
};
