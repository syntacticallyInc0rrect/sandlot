import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {authorIconUrl, thumbnailUrl} from "../state/state";

export const ReadyCheckDMEmbed = (path: String): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Ready Check!`,
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: `Your 5v5 Sandstorm Game is Ready`,
                value: `Click [here](${path}) to be taken back to the Ready Check :)`,
                inline: false
            },
        ]
        ,
        footer: {
            text: "Ready Check!",
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};