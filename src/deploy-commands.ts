import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {clientId, guildId, token} from './secrets/config.json';
import * as fs from "fs";

const commands: JSON[] = fs.readdirSync('./src/commands')
    .filter(f => f.endsWith('.ts'))
    .map(file => require(`./commands/${file}`).data.toJSON());

const rest: REST = new REST({version: '9'}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
