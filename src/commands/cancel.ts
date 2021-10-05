import {SlashCommandBuilder} from "@discordjs/builders";
import {activePugs, cancelActivePug, CommandDescOption, CommandNameOption, initiated,} from "../state/state";
import {CommandInteraction} from "discord.js";
import {PickupGame} from "../classes/PickupGame";

const handleCancelCommand = async (interaction: CommandInteraction) => {
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated Pickup Game Bot. " +
                "Run the /initiate command if you would like to initiate the Pickup Game Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (activePugs.length < 1) {
        await interaction.reply({
            content: "There are no active Pickup Games to cancel",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        const activePug: PickupGame | undefined = activePugs.find(ap => ap.textChannel === interaction.channel);
        if (!activePug) {
            await interaction.reply({
                content: "Did not find an Pickup Game tied to this channel. " +
                    "Make sure you run this command from the text channel within the Pickup Game that you wish to cancel.",
                ephemeral: true,
                fetchReply: false
            });
        } else {
            await cancelActivePug(activePug);
            await interaction.reply({
                content: "The Pickup Game was cancelled.",
                ephemeral: true,
                fetchReply: false
            });
        }
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.cancel)
        .setDescription(CommandDescOption.cancel)
        .setDefaultPermission(false)
    ,
    async execute(interaction: CommandInteraction) {
        await handleCancelCommand(interaction).catch(e => console.log(e));
    },
};