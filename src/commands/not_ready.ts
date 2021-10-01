import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {
    activePugs,
    cancelActivePug,
    CommandDescOption,
    CommandNameOption,
    initiated, pugQueueBotMessage,
    queuedUsers
} from "../state/state";
import {PickupGame} from "../classes/PickupGame";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";

const handleNotReadyCommand = async (interaction: CommandInteraction) => {
    const activePug: PickupGame | undefined = activePugs.find(ap => ap.players.find(p => p.user === interaction.user));
    if (!initiated || !activePug) {
        await interaction.reply({
            content: "You are not in an active Pickup Game to Cancel.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (!!activePug.redTeamVoiceChannel) {
        await interaction.reply({
            content: "Your Pickup Game is already passed the Ready Check phase. It is too late to Cancel.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        const playerThatCancelled = activePug.players.find(p => p.user === interaction.user);
        if (!playerThatCancelled) throw Error("Whadafuq~!");
        activePug.players.splice(activePug.players.indexOf(playerThatCancelled),1);
        if (queuedUsers.length > 0) {
            activePug.players.push({user: queuedUsers[0], isReady: false});
            //todo: send Ready Check DM to queuedUser[0];
            queuedUsers.splice(0, 1);
            await activePug.message.edit({
                embeds: [ReadyCheckEmbed(activePug.players)]
            });
            await pugQueueBotMessage.edit({
                embeds: [MapPoolEmbed(), QueueEmbed()]
            });
            await interaction.reply({
                content: 'You have left the Ready Check and you were substituted by the first person in the Queue!',
                ephemeral: true,
                fetchReply: false
            });
        } else {
            activePug.players.forEach(p => queuedUsers.push(p.user));
            //todo: "send DMs for Ready Check cancelled by..."
            await cancelActivePug(activePug);
            await pugQueueBotMessage.edit({
                embeds: [MapPoolEmbed(), QueueEmbed()]
            });
            await interaction.reply({
                content: 'You have cancelled the Ready Check, left the Pickup Game, ' +
                    'and reverted it back to the Queue state.',
                ephemeral: true,
                fetchReply: false
            });
        }
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.not_ready)
        .setDescription(CommandDescOption.not_ready),
    async execute(interaction: CommandInteraction) {
        await handleNotReadyCommand(interaction);
    },
};
