import {MessageActionRow} from "discord.js";
import {ButtonCustomIdOption, ButtonRowProps} from "../state/state";
import {generateActionRow} from "../helpers/generateActionRow";

export const EndPugButtonRow = (): MessageActionRow => {
    const props: ButtonRowProps[] = [{
        customId: ButtonCustomIdOption.end.valueOf(),
        label: 'End PUG', style: 'DANGER', emoji: '🔚'
    }];
    return generateActionRow(props);
};
