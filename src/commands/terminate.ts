import {SlashCommandBuilder} from '@discordjs/builders';
import {Channel, CommandInteraction} from "discord.js";
import {
    activePugs,
    CommandDescOption,
    CommandNameOption,
    guild,
    initiated,
    pugQueueBotTextChannel,
    pugQueueCategory,
    pugQueueTextChannel,
    pugQueueVoiceChannel,
    resetBot,
    updateInitiate
} from "../state/state";
import {PickupGame} from "../classes/PickupGame";

const deletePugChannels = async (pug: PickupGame) => {
    const channelExists = (channel: Channel) => !!guild.channels.cache.get(channel.id);
    channelExists(pug.category) && await pug.category.delete();
    channelExists(pug.textChannel) && await pug.textChannel.delete();
    channelExists(pug.voiceChannel) && await pug.voiceChannel.delete();
    pug.redTeamVoiceChannel && channelExists(pug.redTeamVoiceChannel) && await pug.redTeamVoiceChannel.delete();
    pug.blueTeamVoiceChannel && channelExists(pug.blueTeamVoiceChannel) && await pug.blueTeamVoiceChannel.delete();
};

const handleTerminateCommand = async (interaction: CommandInteraction) => {
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated PUG Bot to be terminated. " +
                "Run the /initiate command if you would like to initiate the PUG Bot.",
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
        await activePugs.forEach(ap => deletePugChannels(ap));
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
        await handleTerminateCommand(interaction);
    },
};
