import {CategoryChannel, Message, PartialUser, TextChannel, User, VoiceChannel} from "discord.js";

export let initiated: boolean;
export const updateInitiate = () => initiated = !initiated;

export let pugQueueCategory: CategoryChannel;
export const updatePugQueueCategory = (pqc: CategoryChannel) => pugQueueCategory = pqc;
export let pugQueueBotTextChannel: TextChannel;
export const updatePugQueueBotTextChannel = (pqbtc: TextChannel) => pugQueueBotTextChannel = pqbtc;
export let pugQueueTextChannel: TextChannel;
export const updatePugQueueTextChannel = (pqtc: TextChannel) => pugQueueTextChannel = pqtc;
export let pugQueueVoiceChannel: VoiceChannel;
export const updatePugQueueVoiceChannel = (pqvc: VoiceChannel) => pugQueueVoiceChannel = pqvc;
export let pugQueueBotMessage: Message;
export const updatePugQueueBotMessage = (pqbm: Message) => pugQueueBotMessage = pqbm;

export enum MultiplesAction {
    REMOVE = 0,
    ADD = 1
}

export const queuedUsers: (User | PartialUser)[] = [];
export const updateQueuedUsers = (user: (User | PartialUser), action: MultiplesAction) => {
    switch (action) {
        case MultiplesAction.ADD:
            queuedUsers.push(user);
            break;
        case MultiplesAction.REMOVE:
            queuedUsers.splice(queuedUsers.indexOf(user), 1);
            break;
        default:
            break;
    }
}
