import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {authorIconUrl, thumbnailUrl} from "../state/state";

export const FailedReadyCheckDMEmbed = (path: String, usernames: string[]): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: "Failed Ready Check!",
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: `Your Ready Check was unsuccessful. You have been added back to the Pickup Game Queue`,
                value: `Click [here](${path}) to be taken back to the PUG Queue :)`,
                inline: false
            },
        ],
        footer: {
            text: `Your Ready Check was Failed. The following players were not ready in time: ${usernames}`,
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};
