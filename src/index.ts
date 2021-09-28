import {Collection, Intents, Interaction, MessageReaction, PartialMessageReaction} from "discord.js";
import {token} from "./secrets/config.json";
import * as fs from "fs";
import {ButtonCustomIdOption, clientUser, CommandNameOption, updateClientUser} from "./state";

const {Client} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

const commandFiles = fs.readdirSync('./src/commands');
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('ready', () => {
    updateClientUser(client.user);
    console.log(`Logged in as ${clientUser.tag}!`);
});

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
            case ButtonCustomIdOption.join.valueOf():
                await client.commands.get(CommandNameOption.join.valueOf()).execute(interaction);
                break;
            case ButtonCustomIdOption.leave.valueOf():
                await client.commands.get(CommandNameOption.leave.valueOf()).execute(interaction);
                break;
            case ButtonCustomIdOption.afkImmune.valueOf():
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
