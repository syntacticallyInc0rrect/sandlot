import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {activePugs, assignRandomTeams, CommandDescOption, CommandNameOption, initiated} from "../state/state";
import {PickupGame} from "../classes/PickupGame";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";
import {PickupGameEmbed} from "../embeds/PickupGameEmbed";

const handleReadyCommand = async (interaction: CommandInteraction) => {
    const activePug: PickupGame | undefined = activePugs.find(ap => ap.players.find(p => p.user === interaction.user));
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated Pickup Game Bot for you to Ready-Up to. " +
                "Run the /initiate command if you would like to initiate the Pickup Game Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (!activePug) {
        await interaction.reply({
            content: "You are not in an active Pickup Game to Ready-Up to.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (!!activePug.redTeamVoiceChannel) {
        await interaction.reply({
            content: "Your Pickup Game is already passed the Ready Check phase.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        activePug.players.find(p => p.user === interaction.user)!.isReady = true;
        if (!!activePug.players.find(p => !p.isReady)) {
            await activePug.message.edit({
                embeds: [ReadyCheckEmbed(activePug.players)]
            });
        } else {
            assignRandomTeams(activePug);
            await activePug.message.edit({
                content: "/----- 𝔾𝕒𝕞𝕖 𝕋𝕚𝕞𝕖! -----/",
                embeds: [PickupGameEmbed(activePug)],
                components: []
            })
        }
        await interaction.reply({
            content: "You are now Ready for your Pickup Game!",
            ephemeral: true,
            fetchReply: false
        });
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.ready)
        .setDescription(CommandDescOption.ready),
    async execute(interaction: CommandInteraction) {
        await handleReadyCommand(interaction);
    },
};
