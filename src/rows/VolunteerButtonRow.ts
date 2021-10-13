import {MessageActionRow} from "discord.js";
import {ButtonCustomIdOption, ButtonRowProps} from "../state/state";
import {generateActionRow} from "../helpers/generateActionRow";

export const VolunteerButtonRow = (): MessageActionRow => {
    const props: ButtonRowProps[] = [{
        customId: ButtonCustomIdOption.volunteer.valueOf(),
        label: 'Volunteer to be Captain',
        style: 'SECONDARY', emoji: '⭐'
    }];
    return generateActionRow(props);
};
