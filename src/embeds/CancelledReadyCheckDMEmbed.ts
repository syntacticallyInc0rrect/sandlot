import {MessageEmbed, MessageEmbedOptions} from "discord.js";

export const CancelledReadyCheckDMEmbed = (path: String, username: String): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: "Cancelled Ready Check!",
        thumbnail: {url: "https://cdn.discordapp.com/attachments/444642545650368515/892193157062729738/insurgency-logo-textured-512.png"},
        fields: [
            {
                name: `Your Ready Check was cancelled and you have been added back to the Pickup Game Queue`,
                value: `Click [here](${path}) to be taken back to PUG Queue :)`,
                inline: false
            },
        ],
        footer: {
            text: `Your Ready Check was Cancelled by ${username}`,
            icon_url: "https://images-ext-1.discordapp.net/external/ZUgVOtxXsm71dQ6V7hxBhuIBp4z7-7mWRj3UNiTPPA0/https/i.imgur.com/h2xgWfa.png?width=681&height=676"
        }
    };
    return new MessageEmbed(props);
};
