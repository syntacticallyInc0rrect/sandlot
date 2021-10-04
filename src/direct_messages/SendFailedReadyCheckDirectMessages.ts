import {PartialUser, TextChannel, User} from "discord.js";
import {guild} from "../state/state";
import {FailedReadyCheckDMEmbed} from "../embeds/FailedReadyCheckDMEmbed";

export const SendFailedReadyCheckDirectMessages = async (
    users: (User | PartialUser)[],
    channel: TextChannel,
    usernames: string[]
) => {
    const channelFullPath: String =
            `https://discord.com/channels/${guild.id}/${channel.id}`;
    users.map(async u => await u.send({embeds: [FailedReadyCheckDMEmbed(channelFullPath, usernames)]}));

};