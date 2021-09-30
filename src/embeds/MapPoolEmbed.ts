import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {availableMaps, previousPlayedMaps, suggestedMap} from "../state/state";

export const MapPoolEmbed = (): MessageEmbed => {
    const props: MessageEmbedOptions = {
        author: {
            name: "author:  syntaxErr0rz\n",
            icon_url: "https://images-ext-1.discordapp.net/external/ZUgVOtxXsm71dQ6V7hxBhuIBp4z7-7mWRj3UNiTPPA0/https/i.imgur.com/h2xgWfa.png?width=681&height=676",
            url: "https://github.com/syntacticallyInc0rrect/"
        },
        title: "Map Pool",
        fields: [
            // {
            //     name: "Suggested Map",
            //     value: suggestedMap,
            //     inline: false
            // },
            {
                name: "Recently Played Maps",
                value: previousPlayedMaps.length > 0 ? previousPlayedMaps.toString() : "No maps have been played yet.",
                inline: false
            },
            {
                name: "Available Maps",
                value: availableMaps
                    .toString()
                    .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            }
        ],
        thumbnail: {url: "https://cdn.discordapp.com/attachments/444642545650368515/892193157062729738/insurgency-logo-textured-512.png"},
        image: {url: "https://media.discordapp.net/attachments/444642545650368515/892192879416594472/35065577_199992113974090_7495179052093800448_n.png"}
    };
    return new MessageEmbed(props);
};