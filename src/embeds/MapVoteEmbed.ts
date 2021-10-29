import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {authorIconUrl, availableMaps, thumbnailUrl} from "../state/state";

export const MapVoteEmbed = (countdown: number): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Vote on which Map to play`,
        description: `${countdown}s remaining`,
        thumbnail: {url: thumbnailUrl},
        fields: [{
                name: `Available Maps`,
                value: availableMaps.length < 1 ?
                    'No available maps, contact an Admin.' :
                    availableMaps.toString().replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            }]
        ,
        footer: {
            text: "You only get one vote--so make it count.",
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};
