import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {authorIconUrl, matchSize, queuedUsers, thumbnailUrl} from "../state/state";
import {memberNicknameMention} from "@discordjs/builders";

export const QueueEmbed = (): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: "Queue",
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: `${queuedUsers.length}/${matchSize}`,
                value: queuedUsers.length > 0 ?
                    queuedUsers.map(qu => memberNicknameMention(qu.id))
                        .toString()
                        .replace(/\s*,\s*|\s+,/g, "\n") :
                    "Waiting on first player.",
                inline: false
            }
        ],
        footer: {
            text: queuedUsers.length > 0 ?
                "Good luck, have fun!" :
                "Be the first to join the queue! Start a revolution!",
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};