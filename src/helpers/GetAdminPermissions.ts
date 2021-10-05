import {Guild, OverwriteResolvable, Role} from "discord.js";
import {adminRoleName} from "../secrets/config.json";

export const GetAdminPermissions = (guild: Guild): OverwriteResolvable[] => {
    const everyoneRole: Role | undefined = guild.roles.cache.find(r => r.name === '@everyone');
    const adminRole: Role | undefined = guild.roles.cache.find(r => r.name.toLowerCase() === adminRoleName);
    if (!everyoneRole) throw Error("This Guild does not contain an @everyone role.");
    if (!adminRole) throw Error("You must configure an adminRoleName in the secrets/config.json " +
        "and that role must exist in your Guild.");
    return [
        {
            id: everyoneRole.id,
            deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'VIEW_CHANNEL'],
        },
        {
            id: adminRole.id,
            allow: ['ADMINISTRATOR']
        }
    ];
};
