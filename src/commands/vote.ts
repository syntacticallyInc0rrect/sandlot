import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {activePugs, CommandDescOption, CommandNameOption, initiated} from "../state/state";
import {PickupGame} from "../classes/PickupGame";

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
    const replyContent = (!initiated) ?
        "There is no initiated Pickup Game Bot for you to vote on a map with. " +
        "Run the /initiate command if you would like to initiate the Pickup Game Bot." :
        (!activePug) ? "You are not in an active Pickup Game to vote on a map for." :
            (!!activePug.maps.find(m => m.user === interaction.user)) ?
                "You already cast your vote. You are out of votes for this Pickup Game." :
                    `You voted for ${interaction.values[0].substring(5)}!`;

    if (initiated && !!activePug && !activePug.maps.find(m => m.user === interaction.user))
        activePug.maps.push({ map: interaction.values[0].substring(5), user: interaction.user });

    await interaction.reply({
        content: replyContent,
        ephemeral: true,
        fetchReply: false
    });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.vote.valueOf())
        .setDescription(CommandDescOption.vote.valueOf()),
    async execute(interaction: CommandInteraction) {
        await handlePickCommand(interaction).catch(e => console.log(e));
    },
};
