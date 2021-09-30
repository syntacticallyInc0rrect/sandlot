import {bold, SlashCommandBuilder} from "@discordjs/builders";
import {CategoryChannel, CommandInteraction, Message, Role, TextChannel, VoiceChannel} from "discord.js";
import {
    activePugs,
    CommandDescOption,
    CommandNameOption,
    increasePugCount,
    initiated,
    matchSize,
    MultiplesAction,
    pugCount,
    pugQueueBotMessage,
    queuedUsers,
    ReadyCheckPlayer,
    updateActivePugs,
    updateQueuedUsers,
    wipeQueuedUsers
} from "../state/state";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";
import {PickupGame} from "../classes/PickupGame";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";
import {ReadyCheckButtonRow} from "../rows/ReadyCheckButtonRow";

const createNewActivePug = async (interaction: CommandInteraction) => {
    const guild = interaction.guild;
    const players = [...queuedUsers];
    let category: CategoryChannel;
    let textChannel: TextChannel;
    let voiceChannel: VoiceChannel;
    let message: Message;

    const movePlayersToVoiceChannel = async () => {
        if (!guild) throw Error("Your PUG is attempting to kick off in a non-existent Guild.");
        guild.members.cache.forEach(m => {
            if (m.voice.channel !== null) {
                if (players.find(p => p.id === m.user.id)) {
                    m.voice.setChannel(voiceChannel);
                }
            }
        });
    };

    if (!guild) throw Error("You must run this command inside of a Discord Guild.");
    await guild.channels.create(`PUG #${pugCount}`, {type: "GUILD_CATEGORY"})
        .then(async cat => {
            category = cat;
            const everyoneRole: Role | undefined = guild.roles.cache.find(r => r.name === '@everyone');
            if (!everyoneRole) throw Error("This Guild does not contain an @everyone role.");
            await guild.channels.create("ready-check", {
                parent: category,
                type: "GUILD_TEXT",
                permissionOverwrites: [{
                    id: everyoneRole.id,
                    deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
                    allow: ['VIEW_CHANNEL']
                }]
            }).then(async tc => {
                textChannel = tc;
                await textChannel.send({
                    content: bold("/----- 𝙍𝙚𝙖𝙙𝙮 𝘾𝙝𝙚𝙘𝙠 -----/"),
                    embeds: [ReadyCheckEmbed(players.map(p => <ReadyCheckPlayer>{user: p, isReady: false}))],
                    components: [ReadyCheckButtonRow()]
                }).then(m => message = m);
            });
            await guild.channels.create(`PUG #${pugCount} VC`, {
                parent: category,
                type: "GUILD_VOICE"
            }).then(vc => voiceChannel = vc);
            updateActivePugs(
                new PickupGame(
                    pugCount,
                    players.map(p => <ReadyCheckPlayer>{user: p, isReady: false}),
                    category,
                    textChannel,
                    voiceChannel,
                    message
                ),
                MultiplesAction.ADD
            );
            await movePlayersToVoiceChannel();
            wipeQueuedUsers();
        });
};

const handleJoinCommand = async (interaction: CommandInteraction) => {
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated Pickup Game Bot to be added to. " +
                "Run the /initiate command if you would like to initiate the Pickup Game Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else if (!!activePugs.find(ap => ap.players.find(p => p.user === interaction.user))) {
        await interaction.reply({
            content: "You are already in an active Pickup Game. You cannot Queue again until your Pickup Game is over.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        const replyMessage: string = updateQueuedUsers(interaction.user, MultiplesAction.ADD);
        if (queuedUsers.length === matchSize) {
            increasePugCount();
            await createNewActivePug(interaction);
        }
        await pugQueueBotMessage.edit({
            embeds: [MapPoolEmbed(), QueueEmbed()]
        });
        await interaction.reply({
            content: replyMessage,
            ephemeral: true,
            fetchReply: false
        });
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandNameOption.join.valueOf())
        .setDescription(CommandDescOption.join.valueOf()),
    async execute(interaction: CommandInteraction) {
        await handleJoinCommand(interaction);
    },
};
