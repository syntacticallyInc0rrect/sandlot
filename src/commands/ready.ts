import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {activePugs, CommandDescOption, CommandNameOption, initiated, PugPlayer} from "../state/state";
import {PickupGame} from "../classes/PickupGame";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";
import {assignRandomCaptains} from "../helpers/assignRandomCaptains";
import {TeamPickEmbed} from "../embeds/TeamPickEmbed";
import {PlayerSelectRow} from "../rows/PlayerSelectRow";

const handleReadyCommand = async (interaction: CommandInteraction) => {
    const activePug: PickupGame | undefined = activePugs.find(ap => ap.players.find(p => p.user === interaction.user));
    const replyContent = (!initiated) ?
        "There is no initiated Pickup Game Bot for you to Ready-Up to. " +
        "Run the /initiate command if you would like to initiate the Pickup Game Bot." :
        (!activePug) ? "You are not in an active Pickup Game to Ready-Up to." :
            (activePug.pastReadyCheck()) ?
                "Your Pickup Game is already passed the Ready Check phase." :
                "You are now Ready for your Pickup Game!";
    if (initiated && !!activePug && !activePug.pastReadyCheck()) {
        const maybePugPlayer: PugPlayer | undefined = activePug.players.find(p => p.user === interaction.user);
        if (!maybePugPlayer) throw Error(
            "Somehow the interaction user is not found in the Pickup Game players when they were expected to be."
        );
        maybePugPlayer.isReady = true;
        if (!!activePug.players.find(p => !p.isReady)) {
            await activePug.message.edit({
                embeds: [ReadyCheckEmbed(activePug.players, activePug.readyCheckCountdown)]
            });
        } else {
            assignRandomCaptains(activePug);
            const isNotCaptain = (p: PugPlayer) => p.user !== activePug.redTeamCaptain && p.user !== activePug.blueTeamCaptain;
            const players = activePug.players.filter(p => isNotCaptain(p)).map(p => p.user);
            await activePug.textChannel.edit({name: "pick-teams"});
            await activePug.message.edit({
                content: "/----- 𝙋𝙞𝙘𝙠 𝙏𝙚𝙖𝙢𝙨! -----/",
                embeds: [TeamPickEmbed(activePug, activePug.redTeamCaptain)],
                components: [PlayerSelectRow(players)]
            });
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
        .setName(CommandNameOption.ready)
        .setDescription(CommandDescOption.ready),
    async execute(interaction: CommandInteraction) {
        await handleReadyCommand(interaction).catch(e => console.log(e));
    },
};
