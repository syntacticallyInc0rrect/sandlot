import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {authorIconUrl, thumbnailUrl} from "../state/state";

export const CancelledReadyCheckDMEmbed = (path: String, username: string): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: "Cancelled Ready Check!",
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: `Your Ready Check was cancelled and you have been added back to the Pickup Game Queue`,
                value: `Click [here](${path}) to be taken back to the PUG Queue :)`,
                inline: false
            },
        ],
        footer: {
            text: `Your Ready Check was Cancelled by ${username}`,
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};
