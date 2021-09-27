import {memberNicknameMention, SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, MessageEmbedOptions} from "discord.js";
import {initiated, MultiplesAction, pugQueueBotMessage, queuedUsers, updateQueuedUsers} from "../state";
import {BotMessageEmbed} from "../builders/BotMessageEmbed";
// import {client} from "../index";

const handleJoinCommand = async (interaction: CommandInteraction) => {
    if (!initiated) {
        await interaction.reply({
            content: "There is no initiated PUG Bot to be added to. " +
                "Run the /initiate command if you would like to initiate the PUG Bot.",
            ephemeral: true,
            fetchReply: false
        });
    } else {
        updateQueuedUsers(interaction.user, MultiplesAction.ADD);
        const embedProps: MessageEmbedOptions = {
            // author: client.user.username,
            title: "Pickup Game Queue",
            // thumbnail:,
            fields: [
                {
                    name: "Map Pool",
                    value: "Tell West Only!",
                    inline: true
                },
                {
                    name: `In Queue - ${queuedUsers.length}/10`,
                    value: queuedUsers.length > 0 ?
                        queuedUsers
                            .map(qu => memberNicknameMention(qu.id)+"\n")
                            .toString()
                            .replace(",", "") :
                        "Waiting on first player.",
                    inline: false
                }
            ],
            footer: {
                text: queuedUsers.length > 0 ?
                    "Good luck, have fun!" :
                    "Be the first to join the queue! Start a revolution!"
            }
        };
        await pugQueueBotMessage.edit({
            embeds: [BotMessageEmbed(embedProps)]
        });
        await interaction.reply({
            content: "You have been added to the PUG Queue!",
            ephemeral: true,
            fetchReply: false
        })
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Adds user to the PUG Queue'),
    async execute(interaction: CommandInteraction) {
        await handleJoinCommand(interaction);
    },
};