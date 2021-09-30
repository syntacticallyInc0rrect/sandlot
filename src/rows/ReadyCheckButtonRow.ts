import {MessageActionRow, MessageButton} from "discord.js";
import {ButtonCustomIdOption, ButtonRowProps} from "../state/state";

export const ReadyCheckButtonRow = (): MessageActionRow => {
    const props: ButtonRowProps[] = [
        {customId: ButtonCustomIdOption.ready.valueOf(), label: 'Ready', style: 'SUCCESS', emoji: '✔'},
        {customId: ButtonCustomIdOption.not_ready.valueOf(), label: 'Cancel', style: 'DANGER', emoji: '✖'},
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
