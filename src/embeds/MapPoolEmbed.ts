import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {authorIconUrl, availableMaps, imageUrl, previousPlayedMaps, suggestedMap, thumbnailUrl} from "../state/state";

export const MapPoolEmbed = (): MessageEmbed => {
    const props: MessageEmbedOptions = {
        author: {
            name: "author:  syntaxErr0rz\n",
            icon_url: authorIconUrl,
            url: "https://github.com/syntacticallyInc0rrect/"
        },
        title: "Map Pool",
        fields: [
            {
                name: "Suggested Map",
                value: suggestedMap,
                inline: false
            },
            {
                name: "Recently Played Maps",
                value: previousPlayedMaps.length > 0 ? previousPlayedMaps.toString() : "No maps have been played yet.",
                inline: false
            },
            {
                name: "Available Maps",
                value: availableMaps
                    .sort()
                    .toString()
                    .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            }
        ],
        thumbnail: {url: thumbnailUrl},
        image: {url: imageUrl}
    };
    return new MessageEmbed(props);
};