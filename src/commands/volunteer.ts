import {SlashCommandBuilder} from "@discordjs/builders";
import {activePugs, CommandDescOption, CommandNameOption, initiated, PugPlayer} from "../state/state";
import {CommandInteraction} from "discord.js";
import {PickupGame} from "../classes/PickupGame";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";

const handleVolunteerCommand = async (interaction: CommandInteraction) => {
    const activePug: PickupGame | undefined = activePugs.find(ap => ap.players.find(p => p.user === interaction.user));
    const replyContent = (!initiated) ?
        "There is no initiated Pickup Game Bot for you to Volunteer as Captain for. " +
        "Run the /initiate command if you would like to initiate the Pickup Game Bot." :
        (!activePug) ? "You are not in an active Pickup Game to Volunteer as Captain for." :
            (activePug.pastReadyCheck()) ?
                "Your Pickup Game is already passed the Ready Check phase." :
                "You have volunteered as a Captain for your Pickup Game!";
    if (initiated && !!activePug && !activePug.pastReadyCheck()) {
        const maybePugPlayer: PugPlayer | undefined = activePug.players.find(p => p.user === interaction.user);
        if (!maybePugPlayer) throw Error(
            "Somehow the interaction user is not found in the Pickup Game players when they were expected to be."
        );
        maybePugPlayer.isVolunteer = true;
        if (!!activePug.players.find(p => !p.isReady)) {
            await activePug.message.edit({
                embeds: [ReadyCheckEmbed(activePug.players, activePug.readyCheckCountdown)]
            });
        }
        await interaction.reply({
            content: replyContent,
            ephemeral: true,
            fetchReply: false
        });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.ready)
        .setDescription(CommandDescOption.ready),
    async execute(interaction: CommandInteraction) {
        await handleVolunteerCommand(interaction).catch(e => console.log(e));
    },
};