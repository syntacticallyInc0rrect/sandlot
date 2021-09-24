import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initialize')
        .setDescription('Initializes the PUG Bot'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('Initialize feature coming soon!');
    },
};
