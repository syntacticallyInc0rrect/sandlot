import {SlashCommandBuilder} from "@discordjs/builders";
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {clientId, guildId, token} from './secrets/config.json';

const commands = [new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!')]
    .map(command => command.toJSON());

const rest: REST = new REST({version: '9'}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
