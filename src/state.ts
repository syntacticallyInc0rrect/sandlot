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

export enum CommandNameOption {
    'afkImmune' = 'afkImmune',
    'initiate' = 'initiate',
    'join' = 'join',
    'leave' = 'leave',
    'ping' = 'ping',
    'terminate' = 'terminate'
}

export enum CommandDescOption {
    'afkImmune' = 'Grants user offline immunity',
    'initiate' = 'Initiates the PUG Bot',
    'join' = 'Adds user to the PUG Queue',
    'leave' = 'Removes user from the PUG Queue',
    'ping' = 'Replies with Pong!',
    'terminate' = 'Terminates the PUG Bot'
}

export enum ButtonCustomIdOption {
    'afkImmune' = 'afkImmune',
    'join' = `joinQueue`,
    'leave' = 'leaveQueue'
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

export const previousPlayedMaps: string[] = [];
export const updatePreviousPlayedMaps = (map: string, action: MultiplesAction) => {
    switch (action) {
        case MultiplesAction.ADD:
            previousPlayedMaps.push(map);
            break;
        case MultiplesAction.REMOVE:
            previousPlayedMaps.splice(previousPlayedMaps.indexOf(map));
            break;
        default:
            break;
    }
};

//TODO: configurable map pool
export const availableMaps: string[] = [
    "Farmhouse West",
    "Hideout West",
    "Ministry",
    "Outskirts West",
    "Powerplant West",
    "Precinct East",
    "Refinery",
    "Summit East",
    "Tell East",
    "Tell West",
    "Tideway West"
];
export const updateAvailableMaps = (map: string, action: MultiplesAction) => {
    switch (action) {
        case MultiplesAction.ADD:
            availableMaps.push(map);
            break;
        case MultiplesAction.REMOVE:
            availableMaps.splice(availableMaps.indexOf(map));
            break;
        default:
            break;
    }
};

export let suggestedMap: string;
export const updateSuggestedMap = () => {
    suggestedMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
};

export const queuedUsers: (User | PartialUser)[] = [];
export const updateQueuedUsers = (user: (User | PartialUser), action: MultiplesAction): string => {
    switch (action) {
        case MultiplesAction.ADD:
            if (!!queuedUsers.find(qu => qu === user)) return "You are already in the PUG Queue.";
            queuedUsers.push(user);
            return "You have been added to the PUG Queue!";
        case MultiplesAction.REMOVE:
            if (!queuedUsers.find(qu => qu === user)) return "You need to join the PUG Queue before you can leave it.";
            queuedUsers.splice(queuedUsers.indexOf(user), 1);
            return "You have been removed from the PUG Queue!";
        default:
            return "Still need to handle default on updateQueuedUsers";
    }
};

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
};

export const resetBot = () => {
    previousPlayedMaps.forEach(ppm => availableMaps.push(ppm));
    previousPlayedMaps.splice(0, previousPlayedMaps.length);
    queuedUsers.splice(0, queuedUsers.length);
    pugUsers.splice(0, pugUsers.length);
};
