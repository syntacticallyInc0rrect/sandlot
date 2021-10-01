import {PartialUser, TextChannel, User} from "discord.js";
import {guild} from "../state/state";
import {CancelledReadyCheckDMEmbed} from "../embeds/CancelledReadyCheckDMEmbed";

export const SendCancelledReadyCheckDirectMessages = async (
    users: (User | PartialUser)[],
    channel: TextChannel,
    username: string
) => {
    const channelFullPath: String =
            `https://discord.com/channels/${guild.id}/${channel.id}`;
    users.map(async u => await u.send({embeds: [CancelledReadyCheckDMEmbed(channelFullPath, username)]}));

};
