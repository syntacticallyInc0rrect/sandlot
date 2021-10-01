import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from "discord.js";
import {activePugs, assignRandomTeams, CommandDescOption, CommandNameOption, guild, initiated} from "../state/state";
import {PickupGame} from "../classes/PickupGame";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";
import {PickupGameEmbed} from "../embeds/PickupGameEmbed";

const handleReadyCommand = async (interaction: CommandInteraction) => {
    const activePug: PickupGame | undefined = activePugs.find(ap => ap.players.find(p => p.user === interaction.user));
    const replyContent = (!initiated) ?
        "There is no initiated Pickup Game Bot for you to Ready-Up to. " +
        "Run the /initiate command if you would like to initiate the Pickup Game Bot." :
        (!activePug) ? "You are not in an active Pickup Game to Ready-Up to." :
            (!!activePug.redTeamVoiceChannel) ?
                "Your Pickup Game is already passed the Ready Check phase." :
                "You are now Ready for your Pickup Game!";
    if (initiated && !!activePug && !activePug.redTeamVoiceChannel) {
        activePug.players.find(p => p.user === interaction.user)!.isReady = true;
        if (!!activePug.players.find(p => !p.isReady)) {
            await activePug.message.edit({
                embeds: [ReadyCheckEmbed(activePug.players)]
            });
        } else {
            assignRandomTeams(activePug);
            await guild.channels.create("🎮 Insurgents", {
                parent: activePug.category,
                type: "GUILD_VOICE"
            }).then(ic => {
                activePug.redTeamVoiceChannel = ic;
                guild.members.cache.forEach(m => {
                    if (m.voice.channel !== null) {
                        if (activePug.redTeam.find(rtp => rtp.id === m.user.id)) {
                            m.voice.setChannel(ic);
                        }
                    }
                });
            });
            await guild.channels.create("🎮 Security", {
                parent: activePug.category,
                type: "GUILD_VOICE"
            }).then(sc => {
                activePug.blueTeamVoiceChannel = sc;
                guild.members.cache.forEach(m => {
                    if (m.voice.channel !== null) {
                        if (activePug.blueTeam.find(rtp => rtp.id === m.user.id)) {
                            m.voice.setChannel(sc);
                        }
                    }
                });
            });
            await activePug.message.edit({
                content: "/----- 𝙂𝙖𝙢𝙚 𝙏𝙞𝙢𝙚! -----/",
                embeds: [PickupGameEmbed(activePug)],
                components: []
            });
            await activePug.voiceChannel.delete();
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
        await handleReadyCommand(interaction);
    },
};
