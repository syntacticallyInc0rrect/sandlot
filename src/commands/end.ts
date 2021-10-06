import {codeBlock, SlashCommandBuilder} from "@discordjs/builders";
import {
    activePugs,
    cancelActivePug,
    CommandDescOption,
    CommandNameOption,
    initiated,
    MultiplesAction,
    pugAuditTextChannel,
    suggestedMap,
    updatePreviousPlayedMaps, updateSuggestedMap,
} from "../state/state";
import {CommandInteraction} from "discord.js";
import {PickupGame} from "../classes/PickupGame";

const handleEndCommand = async (interaction: CommandInteraction) => {
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated Pickup Game Bot. " +
                "Run the /initiate command if you would like to initiate the Pickup Game Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (activePugs.length < 1) {
        await interaction.reply({
            content: "There are no active Pickup Games to end.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        const activePug: PickupGame | undefined = activePugs.find(ap => ap.textChannel === interaction.channel);
        if (!activePug) {
            await interaction.reply({
                content: "Did not find an Pickup Game tied to this channel. " +
                    "Make sure you run this command from the text channel within the Pickup Game that you wish to end.",
                ephemeral: true,
                fetchReply: false
            });
        } else {
            updatePreviousPlayedMaps(suggestedMap, MultiplesAction.ADD);
            await cancelActivePug(activePug).then(() => pugAuditTextChannel.send({
                content: codeBlock(`Pickup Game #${activePug.id} was ended by ${interaction.user.username}`)
            }));
            await interaction.reply({
                content: "You have ended your Pickup Game.",
                ephemeral: true,
                fetchReply: false
            });
        }
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.end.valueOf())
        .setDescription(CommandDescOption.end.valueOf()),
    async execute(interaction: CommandInteraction) {
        await handleEndCommand(interaction).catch(e => console.log(e));
    },
};