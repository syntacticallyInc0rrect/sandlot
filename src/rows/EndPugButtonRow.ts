import {MessageActionRow, MessageButton} from "discord.js";
import {ButtonCustomIdOption, ButtonRowProps} from "../state/state";

export const EndPugButtonRow = (): MessageActionRow => {
    const props: ButtonRowProps[] = [
        {customId: ButtonCustomIdOption.end.valueOf(), label: 'End PUG', style: 'DANGER', emoji: '🔚'},
    ];
    return new MessageActionRow()
        .addComponents(props
            .map(prop => new MessageButton()
                .setCustomId(prop.customId)
                .setLabel(prop.label)
                .setStyle(prop.style)
                .setEmoji(prop.emoji ? prop.emoji : "")
                .setURL(prop.url ? prop.url : "")
                .setDisabled(prop.disabled ? prop.disabled : false)
            )
        )
};
