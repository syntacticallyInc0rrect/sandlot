import {codeBlock, SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction, Guild, GuildMember} from "discord.js";
import {
    activePugs,
    cancelActivePug,
    CommandDescOption,
    CommandNameOption,
    initiated,
    pugAuditTextChannel,
    pugQueueBotMessage,
    pugQueueBotTextChannel,
    queuedUsers,
    readyCheckTime
} from "../state/state";
import {PickupGame} from "../classes/PickupGame";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";
import {sendReadyCheckDirectMessages} from "../direct_messages/sendReadyCheckDirectMessages";
import {sendCancelledReadyCheckDirectMessages} from "../direct_messages/sendCancelledReadyCheckDirectMessages";

const handleNotReadyCommand = async (interaction: CommandInteraction) => {
    const activePug: PickupGame | undefined = activePugs.find(ap => ap.players.find(p => p.user === interaction.user));
    const replyContent = (!initiated || !activePug) ?
        "You are not in an active Pickup Game to Cancel." :
        (!!activePug.redTeamVoiceChannel) ?
            "Your Pickup Game is already passed the Ready Check phase. It is too late to Cancel." :
            (queuedUsers.length > 0) ?
                "You have left the Ready Check and you were substituted by the first person in the Queue!" :
                "You have cancelled the Ready Check, left the Pickup Game, and reverted it back to the Queue state."
    if (initiated && !!activePug && !activePug.redTeamVoiceChannel) {
        const playerThatCancelled = activePug.players.find(p => p.user === interaction.user);
        if (!playerThatCancelled) {
            console.log("Somehow the Player that Cancelled in the Ready Check does not exist in the Ready Check.");
            return;
        }
        activePug.players.splice(activePug.players.indexOf(playerThatCancelled), 1);
        if (queuedUsers.length > 0) {
            const firstQueuedUser = queuedUsers[0];
            queuedUsers.splice(queuedUsers.indexOf(firstQueuedUser), 1);
            activePug.players.push({user: firstQueuedUser, isReady: false, isVolunteer: false, hasVoted: false});
            activePug.readyCheckCountdown = readyCheckTime;
            await sendReadyCheckDirectMessages([firstQueuedUser], activePug.textChannel);
            await activePug.message.edit({
                embeds: [ReadyCheckEmbed(activePug.players, activePug.readyCheckCountdown)]
            });
            await pugQueueBotMessage.edit({
                embeds: [MapPoolEmbed(), QueueEmbed()]
            });
        } else {
            queuedUsers.push(...activePug.players.map(p => p.user));
            // activePug.players.forEach(p => queuedUsers.push(p.user));
            const maybeGuild: Guild | null = interaction.guild;
            const maybeGuildMember: (GuildMember | null | undefined) = maybeGuild &&
                maybeGuild.members.cache.find(m => m.user === interaction.user);
            const maybeNickname: string | null | undefined = maybeGuild && maybeGuildMember &&
                maybeGuildMember.nickname;
            await cancelActivePug(activePug);
            await pugQueueBotMessage.edit({
                embeds: [MapPoolEmbed(), QueueEmbed()]
            }).then(() => pugAuditTextChannel.send({
                content: codeBlock(`Ready Check cancelled by ${interaction.user.username}`)
            }));
            await sendCancelledReadyCheckDirectMessages(
                activePug.players.map(p => p.user),
                pugQueueBotTextChannel,
                maybeNickname ? maybeNickname : interaction.user.username
            );
        }
    }
    await interaction.reply({
        content: replyContent,
        ephemeral: true,
        fetchReply: false
    });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.not_ready)
        .setDescription(CommandDescOption.not_ready),
    async execute(interaction: CommandInteraction) {
        await handleNotReadyCommand(interaction).catch(e => console.log(e));
    },
};
