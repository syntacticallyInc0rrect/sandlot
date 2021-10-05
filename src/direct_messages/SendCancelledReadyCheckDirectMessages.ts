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
    await Promise.all(
        users.map(async u => await u.send({embeds: [CancelledReadyCheckDMEmbed(channelFullPath, username)]})
            .catch()
            .then(() => Promise.resolve())
        )
    ).catch().then(() => Promise.resolve());

};
