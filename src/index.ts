import {Client, Intents} from "discord.js";
import {token} from "./secrets/config.json";

const client: Client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

client.on('ready', () => console.log(`Logged in as ${client.user!.tag}!`));

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand() && interaction.commandName === 'ping') await interaction.reply('Pong!');
});

client.login(token)
    .then()
    .catch(() => console.log("Error: Invalid Token"));
