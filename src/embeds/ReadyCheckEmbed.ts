import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {memberNicknameMention} from "@discordjs/builders";
import {authorIconUrl, ReadyCheckPlayer, thumbnailUrl} from "../state/state";


export const ReadyCheckEmbed = (players: ReadyCheckPlayer[]): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Ready Check!`,
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: `Who is ready?`,
                value: players.map(
                    p => `${p.isReady ? '✅' : '❌'}  ${memberNicknameMention(p.user.id)}`
                )
                    .toString()
                    .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            },
        ]
        ,
        footer: {
            text: "Let's do this!",
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};