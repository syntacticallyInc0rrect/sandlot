import {PartialUser, User, VoiceChannel} from "discord.js";
import {guild} from "../state/state";

export const moveUsersToVoiceChannel = async (
    users: (User | PartialUser)[],
    voiceChannel: VoiceChannel
): Promise<any> => {
    if (!guild) throw Error("Your Pickup Game is attempting to kick off in a non-existent Guild.");
    await Promise.all(guild.members.cache.map(async member => {
        if (!member.voice) return Promise.resolve();
        if (!users.find(u => u.id === member.user.id)) return Promise.resolve();
        await member.voice.setChannel(voiceChannel)
            .catch(
                () => console.log(`${member.nickname ? member.nickname : member.user.username} was not found in a VC`)
            );
    })).then(() => Promise.resolve());
};
