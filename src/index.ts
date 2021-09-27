import {Collection, Intents, Interaction, MessageReaction, PartialMessageReaction} from "discord.js";
import {token} from "./secrets/config.json";
import * as fs from "fs";

const {Client} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

const commandFiles = fs.readdirSync('./src/commands');
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('ready', () => console.log(`Logged in as ${client.user!.tag}!`));

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    } else if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'joinQueue':
                await client.commands.get('join').execute(interaction);
                break;
            case 'leaveQueue':
                break;
            case 'afkImmune':
                break;
            default:
                return;
        }
    } else {
        return;
    }
});

client.on('messageReactionAdd', async (reaction: (MessageReaction | PartialMessageReaction)) => {
    await reaction.message.reactions.removeAll();
});

client.login(token).catch(() => console.log("Error: Invalid Token"));
