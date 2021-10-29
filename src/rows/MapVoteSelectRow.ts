import {MessageActionRow, MessageSelectMenu, MessageSelectOptionData, PartialUser, User} from "discord.js";
import {availableMaps, CommandNameOption} from "../state/state";

export const MapVoteSelectRow = (): MessageActionRow => {
    const options: MessageSelectOptionData[] = availableMaps.map(m => {
        return {
            label: m,
            description: `Vote for ${m}.`,
            value: `vote_${m}`
        }
    });
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(CommandNameOption.vote.valueOf())
                .setPlaceholder('Vote on which map to play')
                .addOptions(options)
        );
};
