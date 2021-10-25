import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction, PartialUser, User} from "discord.js";
import {activePugs, CommandDescOption, CommandNameOption, initiated, matchSize, PugPlayer} from "../state/state";
import {PickupGame} from "../classes/PickupGame";
import {usernameOrNickname} from "../helpers/usernameOrNickname";
import {TeamPickEmbed} from "../embeds/TeamPickEmbed";
import {PlayerSelectRow} from "../rows/PlayerSelectRow";

const handlePickCommand = async (interaction: CommandInteraction) => {
    if (!interaction.isSelectMenu()) {
        await interaction.reply({
            content: 'This command must be called through the Select Menu.',
            ephemeral: true,
            fetchReply: false
        });
        return;
    }
    const activePug: (PickupGame | undefined) = activePugs.find(ap => ap.players.find(p => p.user === interaction.user));
    const pickedPlayer: (User | PartialUser | undefined) =
        activePug && activePug.players.find(p => p.user.id === interaction.values[0].substring(5))
            && activePug.players.find(p => p.user.id === interaction.values[0].substring(5))!.user;
    const replyContent = (!initiated) ?
        "There is no initiated Pickup Game Bot for you to pick teams with. " +
        "Run the /initiate command if you would like to initiate the Pickup Game Bot." :
        (!activePug) ? "You are not in an active Pickup Game to pick teams for." :
            (interaction.user !== activePug.redTeamCaptain && interaction.user !== activePug.blueTeamCaptain) ?
                "Your are not authorized to pick teams. You must be a captain to be pick team mates." :
                (interaction.user !== activePug.teamPick) ?
                    "It is not your pick. Wait your turn." :
                    `You picked ${!!pickedPlayer ? usernameOrNickname(pickedPlayer) : 'someone'}!`;

    if (initiated && !!activePug && interaction.user === activePug.teamPick) {
        const currentTeamPicking: (User | PartialUser)[] = activePug.redTeam.find(p => p === activePug.teamPick) ?
            activePug.redTeam :
            activePug.blueTeam;
        const pickedPlayer: (PugPlayer | undefined) = activePug.players.find(p => `pick_${p.user.id}` === interaction.values[0]);
        if (!pickedPlayer) {
            await interaction.reply({
                content: 'This player is not in the current Pickup Game. Please select someone who is.',
                ephemeral: true,
                fetchReply: false
            });
            return;
        }
        currentTeamPicking.push(pickedPlayer.user);
        activePug.toggleTeamPick();
        if ((activePug.redTeam.length + activePug.blueTeam.length) === matchSize) {
            //TODO: call next phase
            await activePug.message.edit({
                content: "Now you need to make the Map Check"
            })
        } else {
            const players = activePug.players
                .map(pugPlayer => pugPlayer.user)
                .filter(pugPlayerUser =>
                    !activePug.redTeam.find(rtp => rtp === pugPlayerUser) &&
                    !activePug.blueTeam.find(btp => btp === pugPlayerUser)
                );
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
        .setName(CommandNameOption.pick.valueOf())
        .setDescription(CommandDescOption.pick.valueOf()),
    async execute(interaction: CommandInteraction) {
        await handlePickCommand(interaction).catch(e => console.log(e));
    },
};
