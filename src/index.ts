import {Collection, Intents, Interaction, MessageReaction, PartialMessageReaction,} from "discord.js";
import {guildId, token} from "./secrets/config.json";
import * as fs from "fs";
import {ButtonCustomIdOption, CommandNameOption, updateClient, updateGuild} from "./state/state";
import {deployCommands} from "./init/deployCommands";
import {commandPermissions} from "./init/commandPermissions";
import {EndPugSelectRow} from "./rows/EndPugSelectRow";

export const isDev: boolean = process.argv[0].endsWith('ts-node');

const {Client} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

const commandFiles = fs.readdirSync(isDev ? './src/commands' : './bin/commands')
    .filter(f => f.endsWith('.js') || f.endsWith('.ts'));
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
    updateClient(client);
    updateGuild(client.guilds.cache.get(guildId));
    console.log(`Logged in as ${client.user.tag}!`);
    await deployCommands();
    await commandPermissions();
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
            case ButtonCustomIdOption.ready.valueOf():
                await client.commands.get(CommandNameOption.ready.valueOf()).execute(interaction);
                break;
            case ButtonCustomIdOption.not_ready.valueOf():
                await client.commands.get(CommandNameOption.not_ready.valueOf()).execute(interaction);
                break;
            case ButtonCustomIdOption.volunteer.valueOf():
                await client.commands.get(CommandNameOption.volunteer.valueOf()).execute(interaction);
                break;
            case ButtonCustomIdOption.end.valueOf():
                await interaction.reply({
                    content: 'Are you sure you want to end the Pickup Game? ' +
                        'This will be logged for Administrators to audit.',
                    components: [EndPugSelectRow()],
                    ephemeral: true
                });
                break;
            default:
                return;
        }
    } else if (interaction.isSelectMenu()) {
        switch (interaction.customId) {
            case ButtonCustomIdOption.end.valueOf():
                if (interaction.values[0] === 'end_pug')
                    await client.commands.get(CommandNameOption.end.valueOf()).execute(interaction);
                else
                    await interaction.reply({content: 'Your command was cancelled.', ephemeral: true});
                break;
            case ButtonCustomIdOption.pick.valueOf():
                await client.commands.get(CommandNameOption.pick.valueOf()).execute(interaction);
                break;
            case ButtonCustomIdOption.vote.valueOf():
                await client.commands.get(CommandNameOption.vote.valueOf()).execute(interaction);
                break;
            default:
                break;
        }
        return;
    } else {
        return;
    }
});

client.on('messageReactionAdd', async (reaction: (MessageReaction | PartialMessageReaction)) => {
    await reaction.message.reactions.removeAll();
});

client.login(token).catch(() => console.log("Error: Invalid Token"));
