import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {memberNicknameMention} from "@discordjs/builders";
import {authorIconUrl, PugPlayer, thumbnailUrl} from "../state/state";

export const ReadyCheckEmbed = (players: PugPlayer[], countdown: number): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Ready Check!`,
        description: `${countdown}s remaining`,
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: `Who is ready?`,
                value: players.map(
                    p => `${p.isReady ? '✅' : '❌'}  ${memberNicknameMention(p.user.id)}  ${p.isVolunteer ? '⭐' : ''}`
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
