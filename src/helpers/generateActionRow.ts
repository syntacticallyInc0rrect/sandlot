import {MessageActionRow, MessageButton} from "discord.js";
import {ButtonRowProps} from "../state/state";

export const generateActionRow = (props: ButtonRowProps[]) => {
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
        );
};