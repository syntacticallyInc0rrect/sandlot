import {
    CategoryChannel,
    Channel,
    Client,
    EmojiIdentifierResolvable,
    Guild,
    Message,
    MessageButtonStyleResolvable,
    PartialUser,
    TextChannel,
    User,
    VoiceChannel
} from "discord.js";
import {PickupGame} from "../classes/PickupGame";
import {moveUsersToVoiceChannel} from "../helpers/moveUsersToVoiceChannel";

export enum CommandNameOption {
    'afkImmune' = 'afkImmune',
    'cancel' = 'cancel',
    'end' = 'end',
    'initiate' = 'initiate',
    'join' = 'join',
    'leave' = 'leave',
    'not_ready' = 'not_ready',
    'pick' = 'pick',
    'ready' = 'ready',
    'reset' = 'reset',
    'terminate' = 'terminate',
    'volunteer' = 'volunteer',
    'vote' = 'vote'
}

export enum CommandDescOption {
    'afkImmune' = 'Grants user offline immunity',
    'cancel' = 'Cancels an active PUG',
    'end' = 'Ends current PUG',
    'initiate' = 'Initiates the PUG Bot',
    'join' = 'Adds user to the PUG Queue',
    'leave' = 'Removes user from the PUG Queue',
    'not_ready' = 'Cancels PUG from the Ready Check',
    'pick' = 'Assigns picked player to your team',
    'ready' = 'Changes user\'s Ready Check status to Ready',
    'reset' = 'Removes all queued players from the PUG Queue',
    'terminate' = 'Terminates the PUG Bot',
    'volunteer' = 'Volunteer\'s user for PUG Captain',
    'vote' = 'Cast vote for which map to play'
}

export enum ButtonCustomIdOption {
    'afkImmune' = 'afkImmune',
    'end' = 'end',
    'not_ready' = 'not_ready',
    'join' = `joinQueue`,
    'leave' = 'leaveQueue',
    'pick' = 'pick',
    'ready' = 'ready',
    'volunteer' = 'volunteer',
    'vote' = 'vote'
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

export type PugPlayer = {
    user: (User | PartialUser),
    isReady: boolean,
    isVolunteer: boolean,
    hasVoted: boolean
}

export type MapVote = {
    user: (User | PartialUser),
    map: string
}

export let initiated: boolean;
export const updateInitiate = () => initiated = !initiated;

export let client: Client;
export const updateClient = (c: Client) => client = c;

export let guild: Guild;
export const updateGuild = (g: Guild) => guild = g;

export let pugQueueCategory: CategoryChannel;
export const updatePugQueueCategory = (pqc: CategoryChannel) => pugQueueCategory = pqc;
export let pugQueueBotTextChannel: TextChannel;
export const updatePugQueueBotTextChannel = (pqbtc: TextChannel) => pugQueueBotTextChannel = pqbtc;
export let pugAuditTextChannel: TextChannel;
export const updatePugAuditTextChannel = (patc: TextChannel) => pugAuditTextChannel = patc;
export let pugQueueTextChannel: TextChannel;
export const updatePugQueueTextChannel = (pqtc: TextChannel) => pugQueueTextChannel = pqtc;
export let pugQueueVoiceChannel: VoiceChannel;
export const updatePugQueueVoiceChannel = (pqvc: VoiceChannel) => pugQueueVoiceChannel = pqvc;
export let pugQueueBotMessage: Message;
export const updatePugQueueBotMessage = (pqbm: Message) => pugQueueBotMessage = pqbm;

export let pugCount: number = 0;
export const increasePugCount = () => pugCount += 1;

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

export let matchSize: number = 10;
// export let matchSize: number = 4;
export const updateMatchSize = (newSize: number) => matchSize = newSize;

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

export const previousPlayedMaps: string[] = [];
export const updatePreviousPlayedMaps = (map: string, action: MultiplesAction) => {
    switch (action) {
        case MultiplesAction.ADD:
            availableMaps.splice(availableMaps.indexOf(map), 1);
            previousPlayedMaps.push(map);
            if (previousPlayedMaps.length > 3) {
                availableMaps.push(previousPlayedMaps[0]);
                previousPlayedMaps.splice(0, 1);
            }
            updateSuggestedMap();
            break;
        case MultiplesAction.REMOVE:
            previousPlayedMaps.splice(previousPlayedMaps.indexOf(map));
            break;
        default:
            break;
    }
};

export const resetMaps = () => {
    previousPlayedMaps.forEach(ppm => availableMaps.push(ppm));
    previousPlayedMaps.splice(0, previousPlayedMaps.length);
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

export const activePugs: PickupGame[] = [];
export const updateActivePugs = (pug: PickupGame, action: MultiplesAction) => {
    switch (action) {
        case MultiplesAction.ADD:
            activePugs.push(pug);
            break;
        case MultiplesAction.REMOVE:
            activePugs.splice(activePugs.indexOf(pug), 1);
            break;
        default:
            break;
    }
};

export const cancelActivePug = async (activePug: PickupGame) => {
    await moveUsersToVoiceChannel(activePug.players.map(p => p.user), pugQueueVoiceChannel).catch();
    const channelExists = (channel: Channel) => !!guild.channels.cache.get(channel.id);
    if (channelExists(activePug.category)) await activePug.category.delete().catch();
    if (channelExists(activePug.textChannel)) await activePug.textChannel.delete().catch();
    if (channelExists(activePug.voiceChannel)) await activePug.voiceChannel.delete().catch();
    if (activePug.redTeamVoiceChannel && channelExists(activePug.redTeamVoiceChannel))
        await activePug.redTeamVoiceChannel.delete().catch();
    if (activePug.blueTeamVoiceChannel && channelExists(activePug.blueTeamVoiceChannel))
        await activePug.blueTeamVoiceChannel.delete().catch();
    activePugs.splice(activePugs.indexOf(activePug), 1);
};

export const cancelAllActivePugs = () => activePugs.splice(0, activePugs.length);

export const wipeQueuedUsers = () => queuedUsers.splice(0, queuedUsers.length);

export const resetBot = () => {
    resetMaps();
    wipeQueuedUsers();
    cancelAllActivePugs();
};

export const thumbnailUrl =
    "https://cdn.discordapp.com/attachments/444642545650368515/892193157062729738/insurgency-logo-textured-512.png";

export const authorIconUrl =
    "https://images-ext-1.discordapp.net/external/ZUgVOtxXsm71dQ6V7hxBhuIBp4z7-7mWRj3UNiTPPA0/https/i.imgur.com/h2xgWfa.png?width=681&height=676";

export const imageUrl =
    "https://media.discordapp.net/attachments/444642545650368515/892192879416594472/35065577_199992113974090_7495179052093800448_n.png";

/*number of seconds*/
export const readyCheckTime = 150;
export const mapVoteTime = 30;