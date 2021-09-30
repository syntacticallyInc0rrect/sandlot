import {
    ApplicationCommandPermissionData,
    Collection,
    Intents,
    Interaction,
    MessageReaction,
    PartialMessageReaction,
    Role
} from "discord.js";
import {guildId, token} from "./secrets/config.json";
import * as fs from "fs";
import {ButtonCustomIdOption, CommandNameOption, guild, updateClient, updateGuild} from "./state";

const {Client} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

const commandFiles = fs.readdirSync('./src/commands');
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
    updateClient(client);
    updateGuild(client.guilds.cache.get(guildId));
    console.log(`Logged in as ${client.user.tag}!`);
    const adminRole: Role | undefined = guild.roles.cache.find(r => r.name.toLowerCase() === 'admin');
    if (!adminRole) throw Error("You must have an Admin Role in your Guild in order to use this bot.");
    const permissions: ApplicationCommandPermissionData[] = [
        {
            id: adminRole.id,
            type: 'ROLE',
            permission: true,
        },
        {
            id: '442179773633003530',
            type: 'USER',
            permission: true
        }
    ];
    let commandsList = await guild.commands.fetch();
    await commandsList.forEach(c => {
        guild.commands.permissions.add({
            command: c.id,
            permissions: permissions
        })
    });
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
