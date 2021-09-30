import {MessageEmbed, MessageEmbedOptions, PartialUser, User} from "discord.js";
import {memberNicknameMention} from "@discordjs/builders";
import {PickupGame} from "../classes/PickupGame";
import {suggestedMap, updateSuggestedMap} from "../state/state";

export const PickupGameEmbed = (pug: PickupGame): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Pickup Game #${pug.id}`,
        thumbnail: {url: "https://cdn.discordapp.com/attachments/444642545650368515/892193157062729738/insurgency-logo-textured-512.png"},
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
            icon_url: "https://images-ext-1.discordapp.net/external/ZUgVOtxXsm71dQ6V7hxBhuIBp4z7-7mWRj3UNiTPPA0/https/i.imgur.com/h2xgWfa.png?width=681&height=676"
        }
    };
    return new MessageEmbed(props);
};