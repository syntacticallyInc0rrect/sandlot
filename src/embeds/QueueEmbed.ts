import {MessageEmbed, MessageEmbedOptions} from "discord.js";
import {matchSize, queuedUsers} from "../state";
import {memberNicknameMention} from "@discordjs/builders";

export const QueueEmbed = (): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: "Queue",
        thumbnail: {url: "https://cdn.discordapp.com/attachments/444642545650368515/892193157062729738/insurgency-logo-textured-512.png"},
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
            icon_url: "https://images-ext-1.discordapp.net/external/ZUgVOtxXsm71dQ6V7hxBhuIBp4z7-7mWRj3UNiTPPA0/https/i.imgur.com/h2xgWfa.png?width=681&height=676"
        }
    };
    return new MessageEmbed(props);
};