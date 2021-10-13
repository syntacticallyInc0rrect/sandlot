import {MessageActionRow} from "discord.js";
import {ButtonCustomIdOption, ButtonRowProps} from "../state/state";
import {generateActionRow} from "../helpers/generateActionRow";

export const ReadyCheckButtonRow = (): MessageActionRow => {
    const props: ButtonRowProps[] = [
        {customId: ButtonCustomIdOption.ready.valueOf(), label: 'Ready', style: 'SUCCESS', emoji: '✔'},
        {customId: ButtonCustomIdOption.not_ready.valueOf(), label: 'Not Ready', style: 'DANGER', emoji: '✖'},
    ];
    return generateActionRow(props);
};
