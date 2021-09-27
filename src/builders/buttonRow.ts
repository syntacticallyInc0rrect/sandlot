import {
    EmojiIdentifierResolvable,
    MessageActionRow,
    MessageActionRowComponentResolvable,
    MessageButton,
    MessageButtonStyleResolvable
} from "discord.js";

export type ButtonRowProps = {
    customId: string,
    label: string,
    style: MessageButtonStyleResolvable,
    emoji?: EmojiIdentifierResolvable
    url?: string,
    disabled?: boolean
}

export const ButtonRow = (props: ButtonRowProps[]): MessageActionRow => {
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
