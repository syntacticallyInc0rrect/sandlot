import {PartialUser, TextChannel, User} from "discord.js";
import {ReadyCheckDMEmbed} from "../embeds/ReadyCheckDMEmbed";
import {guild} from "../state/state";

export const SendReadyCheckDirectMessages = async (users: (User | PartialUser)[], channel: TextChannel) => {
    const channelFullPath: String =
            `https://discord.com/channels/${guild.id}/${channel.id}`;
    users.map(async u => await u.send({embeds: [ReadyCheckDMEmbed(channelFullPath)]}));

};
