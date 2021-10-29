import {CategoryChannel, Message, PartialUser, TextChannel, User, VoiceChannel} from "discord.js";
import {
    activePugs,
    cancelActivePug,
    guild,
    mapVoteTime,
    matchSize,
    pugQueueBotMessage,
    pugQueueBotTextChannel,
    queuedUsers,
    PugPlayer,
    readyCheckTime,
    MapVote,
} from "../state/state";
import {sendFailedReadyCheckDirectMessages} from "../direct_messages/sendFailedReadyCheckDirectMessages";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";
import {EndPugButtonRow} from "../rows/EndPugButtonRow";
import {PickupGameEmbed} from "../embeds/PickupGameEmbed";
import {MapVoteEmbed} from "../embeds/MapVoteEmbed";
import {MapVoteSelectRow} from "../rows/MapVoteSelectRow";

export class PickupGame {
    private readonly _id: number;
    private readonly _category: CategoryChannel;
    private readonly _textChannel: TextChannel;
    private readonly _voiceChannel: VoiceChannel;
    private readonly _message: Message;
    private readonly _countdownIteration: number = 5000; /*every 5 seconds*/
    private _players: PugPlayer[];
    private _redTeam: (User | PartialUser)[] = [];
    private _blueTeam: (User | PartialUser)[] = [];
    private _redTeamVoiceChannel: VoiceChannel | undefined;
    private _blueTeamVoiceChannel: VoiceChannel | undefined;
    private _readyCheckCountdown: number;
    private _mapVoteCountdown: number;
    private _maps: MapVote[] = [];
    private _map: string = 'No Map Picked';
    private _redTeamCaptain: (User | PartialUser) | undefined;
    private _blueTeamCaptain: (User | PartialUser) | undefined;
    private _teamPick: (User | PartialUser) | undefined;

    constructor(
        id: number,
        players: PugPlayer[],
        category: CategoryChannel,
        textChannel: TextChannel,
        voiceChannel: VoiceChannel,
        message: Message
    ) {
        this._id = id;
        this._players = players;
        this._category = category;
        this._textChannel = textChannel;
        this._voiceChannel = voiceChannel;
        this._message = message;
        this._readyCheckCountdown = readyCheckTime;
        this._mapVoteCountdown = mapVoteTime;
        this.readyCheckTimer();
    }

    get players(): PugPlayer[] {
        return this._players;
    }

    set players(value: PugPlayer[]) {
        this._players = value;
    }

    get redTeam(): (User | PartialUser)[] {
        return this._redTeam;
    }

    set redTeam(value: (User | PartialUser)[]) {
        this._redTeam = value;
    }

    get blueTeam(): (User | PartialUser)[] {
        return this._blueTeam;
    }

    set blueTeam(value: (User | PartialUser)[]) {
        this._blueTeam = value;
    }

    get redTeamVoiceChannel(): VoiceChannel | undefined {
        return this._redTeamVoiceChannel;
    }

    set redTeamVoiceChannel(value: VoiceChannel | undefined) {
        this._redTeamVoiceChannel = value;
    }

    get blueTeamVoiceChannel(): VoiceChannel | undefined {
        return this._blueTeamVoiceChannel;
    }

    set blueTeamVoiceChannel(value: VoiceChannel | undefined) {
        this._blueTeamVoiceChannel = value;
    }

    get readyCheckCountdown(): number {
        return this._readyCheckCountdown;
    }

    get mapVoteCountdown(): number {
        return this._mapVoteCountdown;
    }

    get maps(): MapVote[] {
        return this._maps;
    }

    set maps(value: MapVote[]) {
        this._maps = value;
    }

    get map(): string {
        return this._map;
    }

    set map(value: string) {
        this._map = value;
    }

    get id(): number {
        return this._id;
    }

    get category(): CategoryChannel {
        return this._category;
    }

    get textChannel(): TextChannel {
        return this._textChannel;
    }

    get voiceChannel(): VoiceChannel {
        return this._voiceChannel;
    }

    get message(): Message {
        return this._message;
    }

    get redTeamCaptain(): (User | PartialUser) | undefined {
        return this._redTeamCaptain;
    }

    set redTeamCaptain(value: User | PartialUser | undefined) {
        this._redTeamCaptain = value;
    }

    get blueTeamCaptain(): (User | PartialUser) | undefined {
        return this._blueTeamCaptain;
    }

    set blueTeamCaptain(value: User | PartialUser | undefined) {
        this._blueTeamCaptain = value;
    }

    get teamPick(): (User | PartialUser | undefined) {
        return this._teamPick;
    }

    set teamPick(value: User | PartialUser | undefined) {
        this._teamPick = value;
    }

    toggleTeamPick() {
        this._teamPick = !!this.teamPick && this.teamPick === this.redTeamCaptain ?
            this.blueTeamCaptain :
            this.redTeamCaptain;
    }

    pastReadyCheck(): boolean {
        return !this._players.find(p => !p.isReady);
    }

    readyCheckTimer() {
        setTimeout(async () => {
            if (!activePugs.find(ap => ap === this) || this.pastReadyCheck()) {
                this._readyCheckCountdown = readyCheckTime;
                return;
            }
            if (this._readyCheckCountdown < 1 && !this.pastReadyCheck()) {
                let readyPlayers = this._players.filter(p => p.isReady);
                if ((queuedUsers.length + (matchSize - readyPlayers.length)) < matchSize) {
                    readyPlayers.forEach(rp => queuedUsers.push(rp.user));
                    const usernamesOrNicknames: string[] = this._players
                        .filter(p => !p.isReady)
                        .map(nrp => {
                            const nickname: string | null | undefined = guild.members.cache.find(
                                m => m.user.id === nrp.user.id
                            )?.nickname;
                            return !!nickname ? nickname : !!nrp.user.username ? nrp.user.username : "";
                        });
                    await sendFailedReadyCheckDirectMessages(
                        this._players.map(p => p.user),
                        pugQueueBotTextChannel,
                        usernamesOrNicknames
                    );
                    await cancelActivePug(this);
                    await pugQueueBotMessage.edit({
                        embeds: [MapPoolEmbed(), QueueEmbed()]
                    });
                } else {
                    this._players = this._players.filter(ap => ap.isReady);
                    for (let i = this._players.length; i < matchSize; i++) {
                        const queuedUser = queuedUsers[0];
                        this._players.push({user: queuedUser, isReady: false, isVolunteer: false, hasVoted: false});
                        queuedUsers.splice(queuedUsers.indexOf(queuedUser), 1);
                        if (i === (matchSize - 1)) {
                            await this.message.edit({
                                embeds: [ReadyCheckEmbed(this.players, this._readyCheckCountdown)]
                            });
                            await pugQueueBotMessage.edit({
                                embeds: [MapPoolEmbed(), QueueEmbed()]
                            });
                        }
                    }
                }
                this._readyCheckCountdown = ((readyCheckTime * 1000) / this._countdownIteration);
                return;
            }
            await this.message.edit({
                embeds: [ReadyCheckEmbed(this.players, this._readyCheckCountdown)]
            });
            this._readyCheckCountdown -= (this._countdownIteration / 1000);
            this.readyCheckTimer();
        }, (this._countdownIteration));
    }

    mapVoteTimer() {
        setTimeout(async () => {
            if (this._mapVoteCountdown < 1) {
                type VotedMap = {
                    map: string;
                    count: number;
                }
                const votedMaps: VotedMap[] = [];
                this._maps.forEach(m => {
                    const existingVotedMap: VotedMap | undefined = votedMaps.find(vm => vm.map === m.map);
                    if (!!existingVotedMap) {
                        votedMaps[votedMaps.indexOf(existingVotedMap)].count++;
                    } else {
                        votedMaps.push({map: m.map, count: 1});
                    }
                });
                const highestVoteCount: number =
                    votedMaps.length > 0 ?
                        votedMaps.sort((a, b) => b.count - a.count)[0].count :
                        0;
                const highestVotedMaps: VotedMap[] = votedMaps.filter(vm => vm.count === highestVoteCount);
                this._map = highestVotedMaps[Math.floor(Math.random() * highestVotedMaps.length)].map;
                await this._message.edit({
                    content: "/----- 𝙂𝙖𝙢𝙚 𝙏𝙞𝙢𝙚! -----/",
                    embeds: [PickupGameEmbed(this)],
                    components: [EndPugButtonRow()]
                });
                this._mapVoteCountdown = mapVoteTime;
                return;
            } else {
                await this._message.edit({
                    content: "/----- 𝙈𝙖𝙥 𝙑𝙤𝙩𝙚! -----/",
                    embeds: [MapVoteEmbed(this._mapVoteCountdown)],
                    components: [MapVoteSelectRow()]
                });
                this._mapVoteCountdown -= (this._countdownIteration / 1000);
                this.mapVoteTimer();
            }
        }, (this._countdownIteration));
    }

}
