import {MessageActionRow, MessageSelectMenu} from "discord.js";
import {CommandNameOption} from "../state/state";

export const EndPugSelectRow = (): MessageActionRow => {
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(CommandNameOption.end.valueOf())
                .setPlaceholder('Nothing selected')
                .addOptions([
                    {
                        label: 'Yes',
                        description: 'This will end the PUG and be logged for Administrators to audit.',
                        value: 'end_pug'
                    },
                    {
                        label: 'No',
                        description: 'This will cancel the command.',
                        value: 'cancel_command'
                    }
                ])
        );
};
