import {MessageActionRow, MessageSelectMenu, MessageSelectOptionData, PartialUser, User} from "discord.js";
import {CommandNameOption} from "../state/state";
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
                .setCustomId(CommandNameOption.pick.valueOf())
                .setPlaceholder('Pick your next team mate')
                .addOptions(options)
        );
};
