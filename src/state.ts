import {
    CategoryChannel,
    EmojiIdentifierResolvable,
    Message,
    MessageButtonStyleResolvable,
    PartialUser,
    TextChannel,
    User,
    VoiceChannel
} from "discord.js";

export enum ButtonCustomIdOption {
    'join' = `joinQueue`,
    'leave' = 'leaveQueue',
    'afkImmune' = 'afkImmune'
}

export enum CommandNameOption {
    'initiate' = 'initiate',
    'join' = 'join',
    'leave' = 'leave',
    'ping' = 'ping',
    'terminate' = 'terminate'
}

export enum CommandDescOption {
    'initiate' = 'Initiates the PUG Bot',
    'join' = 'Adds user to the PUG Queue',
    'leave' = 'Removes user from the PUG Queue',
    'ping' = 'Replies with Pong!',
    'terminate' = 'Terminates the PUG Bot'
}

export enum MultiplesAction {
    REMOVE = 0,
    ADD = 1
}

export type ButtonRowProps = {
    customId: string,
    label: string,
    style: MessageButtonStyleResolvable,
    emoji?: EmojiIdentifierResolvable
    url?: string,
    disabled?: boolean
};

export let initiated: boolean;
export const updateInitiate = () => initiated = !initiated;

export let clientUser: User;
export const updateClientUser = (u: User) => clientUser = u;

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

export const queuedUsers: (User | PartialUser)[] = [];
export const updateQueuedUsers = (user: (User | PartialUser), action: MultiplesAction): string => {
    switch (action) {
        case MultiplesAction.ADD:
            if (!!queuedUsers.find(qu => qu === user)) return "You are already in the PUG Queue.";
            queuedUsers.push(user);
            return "You have been added to the PUG Queue!";
        case MultiplesAction.REMOVE:
            queuedUsers.splice(queuedUsers.indexOf(user), 1);
            return "You have been removed from the PUG Queue!";
        default:
            return "Still need to handle default on updateQueuedUsers";
    }
}

export const pugUsers: (User | PartialUser)[] = [];
export const updatePugUsers = (user: (User | PartialUser), action: MultiplesAction) => {
    switch (action) {
        case MultiplesAction.ADD:
            pugUsers.push(user);
            break;
        case MultiplesAction.REMOVE:
            pugUsers.splice(pugUsers.indexOf(user), 1);
            break;
        default:
            break;
    }
}
