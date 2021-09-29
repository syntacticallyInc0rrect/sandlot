import {MessageEmbed, MessageEmbedOptions, PartialUser, User} from "discord.js";
import {memberNicknameMention} from "@discordjs/builders";

type ReadyCheckPlayer = {
    player: (User | PartialUser),
    isReady: boolean
}

export const ReadyCheckEmbed = (players: (User | PartialUser)[]): MessageEmbed => {
    let readyCheckPlayers: ReadyCheckPlayer[] = players.map(p => {
        return {player: p, isReady: false};
    });
    const props: MessageEmbedOptions = {
        title: `Ready Check!`,
        thumbnail: {url: "https://cdn.discordapp.com/attachments/444642545650368515/892193157062729738/insurgency-logo-textured-512.png"},
        fields: [
            {
                name: `Who is ready?`,
                value: readyCheckPlayers.map(
                    rcp => `${rcp.isReady ? '✔' : '❌'}  ${memberNicknameMention(rcp.player.id)}`
                )
                    .toString()
                    .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            },
        ]
            ,
        footer: {
            text:"Let's do this!",
            icon_url: "https://images-ext-1.discordapp.net/external/ZUgVOtxXsm71dQ6V7hxBhuIBp4z7-7mWRj3UNiTPPA0/https/i.imgur.com/h2xgWfa.png?width=681&height=676"
        }
    };
    return new MessageEmbed(props);
};