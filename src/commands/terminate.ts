import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('terminate')
        .setDescription('Terminates the PUG Bot'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({content: "Terminate feature coming soon!", ephemeral: true, fetchReply: false});
        await interaction.user.send("Terminate feature coming soon!");
    },
};
