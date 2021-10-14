import {PartialUser, User} from "discord.js";
import {guild} from "../state/state";

export const usernameOrNickname = (user: (User | PartialUser)): string => {
    const nickname: string | null | undefined = guild.members.cache.find(
        m => m.user.id === user.id
    )?.nickname;
    return !!nickname ? nickname : !!user.username ? user.username : "";
}
