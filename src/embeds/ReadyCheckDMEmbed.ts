import {MessageEmbed, MessageEmbedOptions} from "discord.js";

export const ReadyCheckDMEmbed = (path: String): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Ready Check!`,
        thumbnail: {url: "https://cdn.discordapp.com/attachments/444642545650368515/892193157062729738/insurgency-logo-textured-512.png"},
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
            icon_url: "https://images-ext-1.discordapp.net/external/ZUgVOtxXsm71dQ6V7hxBhuIBp4z7-7mWRj3UNiTPPA0/https/i.imgur.com/h2xgWfa.png?width=681&height=676"
        }
    };
    return new MessageEmbed(props);
};