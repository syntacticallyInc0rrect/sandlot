import {MessageActionRow, MessageButton} from "discord.js";

export const ButtonRow = async (): Promise<MessageActionRow> => {
    const row: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('joinQueue')
                .setLabel('Join')
                .setStyle('SUCCESS')
                .setEmoji('➕'),
            new MessageButton()
                .setCustomId('leaveQueue')
                .setLabel('Leave')
                .setStyle('DANGER')
                .setEmoji('➖'),
            new MessageButton()
                .setCustomId('afkImmunity')
                .setLabel('AFK Immune')
                .setStyle('PRIMARY')
                .setEmoji('⏳')
        );
    return row;
};
