import {MessageActionRow, MessageSelectMenu, MessageSelectOptionData, PartialUser, User} from "discord.js";
import {CommandNameOption, guild} from "../state/state";
import {usernameOrNickname} from "../helpers/usernameOrNickname";

export const PlayerSelectRow = (players: (User | PartialUser)[]): MessageActionRow => {
    const options: MessageSelectOptionData[] = players.map(p => {
        return {
            label: `${usernameOrNickname(p)}`,
            description: `Add ${usernameOrNickname(p)} to your team.`,
            value: `pick_${p.id}`
        }
    });
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(CommandNameOption.end.valueOf())
                .setPlaceholder('Nothing selected')
                .addOptions(options)
        );
};
