import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {memberNicknameMention} from "@discordjs/builders";
import {PickupGame} from "../classes/PickupGame";
import {authorIconUrl, suggestedMap, thumbnailUrl} from "../state/state";

export const PickupGameEmbed = (pug: PickupGame): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Pickup Game #${pug.id}`,
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: "Map",
                value: suggestedMap,
                inline: false
            },
            {
                name: `Insurgents`,
                value: pug.redTeam.map(p => `${memberNicknameMention(p.id)}`)
                    .toString()
                    .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            },
            {
                name: `Security`,
                value: pug.blueTeam.map(p => `${memberNicknameMention(p.id)}`)
                    .toString()
                    .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            }
        ]
        ,
        footer: {
            text: "Good luck, have fun!",
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};