import {Client, Intents, Interaction, MessageReaction, PartialMessageReaction} from "discord.js";
import {token} from "./secrets/config.json";

const client: Client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

client.on('ready', () => console.log(`Logged in as ${client.user!.tag}!`));

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    switch (interaction.commandName) {
        case 'initialize':
            await interaction.reply('Initialize feature coming soon!');
            break;
        case 'ping':
            await interaction.reply('Pong!')
            break;
        case 'terminate':
            await interaction.reply({content: "Terminate feature coming soon!", ephemeral: true, fetchReply: false});
            await interaction.user.send("Terminate feature coming soon!");
            break;
        default:
            break;
    }
});

client.on('messageReactionAdd', async (reaction: (MessageReaction | PartialMessageReaction)) => {
    //TODO: listen for reactions or use message buttons and drop downs? Hmm...
    await reaction.message.reactions.removeAll();
});

client.login(token)
    .then()
    .catch(() => console.log("Error: Invalid Token"));
