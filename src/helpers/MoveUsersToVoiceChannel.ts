import {PartialUser, User, VoiceChannel} from "discord.js";
import {guild} from "../state/state";


export const MoveUsersToVoiceChannel = async (
    users: (User | PartialUser)[],
    voiceChannel: VoiceChannel
): Promise<any> => {
    if (!guild) throw Error("Your Pickup Game is attempting to kick off in a non-existent Guild.");
    await Promise.all(guild.members.cache.map(async member => {
        if (member.voice.channel && member.voice.channel.isVoice()) {
            if (users.find(user => user.id === member.user.id)) {
                await member.voice.setChannel(voiceChannel);
            }
        }
    })).then(() => {
        return Promise.resolve();
    });

};