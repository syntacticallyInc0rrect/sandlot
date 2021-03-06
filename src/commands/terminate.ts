import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {
    activePugs,
    cancelActivePug,
    CommandDescOption,
    CommandNameOption,
    initiated,
    pugQueueBotTextChannel,
    pugQueueCategory,
    pugQueueTextChannel,
    pugQueueVoiceChannel,
    resetBot,
    updateInitiate
} from "../state/state";

const handleTerminateCommand = async (interaction: CommandInteraction) => {
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated Pickup Game Bot to be terminated. " +
                "Run the /initiate command if you would like to initiate the Pickup Game Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        const guild = interaction.guild;
        if (!guild) throw Error("You must run this command inside of a Discord Guild.");
        await guild.channels.cache.forEach(c => {
            switch (c) {
                case pugQueueVoiceChannel:
                    c.delete()
                        .then(() => console.log(
                            `The ${c.name} Voice Channel was deleted by ${interaction.user.username} ` +
                            `with the /terminate command on ${new Date()}`
                        ));
                    break;
                case pugQueueTextChannel:
                    c.delete()
                        .then(() => console.log(
                            `The ${c.name} Text Channel was deleted by ${interaction.user.username} ` +
                            `with the /terminate command on ${new Date()}`
                        ));
                    break;
                case pugQueueBotTextChannel:
                    c.delete()
                        .then(() => console.log(
                            `The ${c.name} Text Channel was deleted by ${interaction.user.username} ` +
                            `with the /terminate command on ${new Date()}`
                        ));
                    break;
                case pugQueueCategory:
                    c.delete()
                        .then(() => console.log(
                            `The ${c.name} Category was deleted by ${interaction.user.username} ` +
                            `with the /terminate command on ${new Date()}`
                        ));
                    break;
                default:
                    break;
            }
        });
        await activePugs.forEach(ap => cancelActivePug(ap));
        updateInitiate();
        resetBot();
        await interaction.reply({
            content: "Your PUG Bot has been terminated!",
            ephemeral: true,
            fetchReply: false
        });
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.terminate.valueOf())
        .setDescription(CommandDescOption.terminate.valueOf())
        .setDefaultPermission(false),
    async execute(interaction: CommandInteraction) {
        await handleTerminateCommand(interaction).catch(e => console.log(e));
    },
};
