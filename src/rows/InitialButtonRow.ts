import {MessageActionRow, MessageButton} from "discord.js";
import {ButtonCustomIdOption, ButtonRowProps} from "../state";

export const InitialButtonRow = (): MessageActionRow => {
    const props: ButtonRowProps[] = [
        {customId: ButtonCustomIdOption.join.valueOf(), label: 'Join', style: 'SUCCESS', emoji: '➕'},
        {customId: ButtonCustomIdOption.leave.valueOf(), label: 'Leave', style: 'DANGER', emoji: '➖'},
        {customId: ButtonCustomIdOption.afkImmune.valueOf(), label: 'AFK Immune', style: 'PRIMARY', emoji: '⏳'}
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
