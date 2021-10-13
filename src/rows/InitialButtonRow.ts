import {MessageActionRow} from "discord.js";
import {ButtonCustomIdOption, ButtonRowProps} from "../state/state";
import {generateActionRow} from "../helpers/generateActionRow";

export const InitialButtonRow = (): MessageActionRow => {
    const props: ButtonRowProps[] = [
        {customId: ButtonCustomIdOption.join.valueOf(), label: 'Join', style: 'SUCCESS', emoji: '➕'},
        {customId: ButtonCustomIdOption.leave.valueOf(), label: 'Leave', style: 'DANGER', emoji: '➖'},
        // {customId: ButtonCustomIdOption.afkImmune.valueOf(), label: 'AFK Immune', style: 'PRIMARY', emoji: '⏳'}
    ];
    return generateActionRow(props);
};
