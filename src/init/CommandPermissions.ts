import {ApplicationCommandPermissionData, Role} from "discord.js";
import {guild} from "../state/state";
import {adminRoleName} from "../secrets/config.json";

export const CommandPermissions = async () => {
    const adminRole: Role | undefined = guild.roles.cache.find(r => r.name.toLowerCase() === adminRoleName);
    if (!adminRole) throw Error("You must configure an adminRoleName in the secrets/config.json " +
        "and that role must exist in your Guild.");
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
    })
    console.log('Updated permissions for all application commands.');
};