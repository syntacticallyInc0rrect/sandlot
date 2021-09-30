import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {clientId, guildId, token} from '../secrets/config.json';
import * as fs from "fs";

export const DeployCommands = async () => {
    const rest: REST = new REST({version: '9'}).setToken(token);

    const commands: JSON[] = fs.readdirSync('./src/commands')
        .map(file => require(`../commands/${file}`).data.toJSON());

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
};

