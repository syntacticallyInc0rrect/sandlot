import {CategoryChannel, Message, PartialUser, TextChannel, User, VoiceChannel} from "discord.js";
import {
    activePugs,
    cancelActivePug,
    guild,
    matchSize,
    pugQueueBotMessage,
    pugQueueBotTextChannel,
    queuedUsers,
    ReadyCheckPlayer
} from "../state/state";
import {SendFailedReadyCheckDirectMessages} from "../direct_messages/SendFailedReadyCheckDirectMessages";
import {MapPoolEmbed} from "../embeds/MapPoolEmbed";
import {QueueEmbed} from "../embeds/QueueEmbed";
import {ReadyCheckEmbed} from "../embeds/ReadyCheckEmbed";

export class PickupGame {
    private readonly _id: number;
    private readonly _category: CategoryChannel;
    private readonly _textChannel: TextChannel;
    private readonly _voiceChannel: VoiceChannel;
    private readonly _message: Message;

    constructor(
        id: number,
        players: ReadyCheckPlayer[],
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
        this._countdown = 24;
        this.readyCheckTimer();
    }

    private _players: ReadyCheckPlayer[];

    get players(): ReadyCheckPlayer[] {
        return this._players;
    }

    set players(value: ReadyCheckPlayer[]) {
        this._players = value;
    }

    private _redTeam: (User | PartialUser)[] = [];

    get redTeam(): (User | PartialUser)[] {
        return this._redTeam;
    }

    set redTeam(value: (User | PartialUser)[]) {
        this._redTeam = value;
    }

    private _blueTeam: (User | PartialUser)[] = [];

    get blueTeam(): (User | PartialUser)[] {
        return this._blueTeam;
    }

    set blueTeam(value: (User | PartialUser)[]) {
        this._blueTeam = value;
    }

    private _redTeamVoiceChannel: VoiceChannel | undefined;

    get redTeamVoiceChannel(): VoiceChannel | undefined {
        return this._redTeamVoiceChannel;
    }

    set redTeamVoiceChannel(value: VoiceChannel | undefined) {
        this._redTeamVoiceChannel = value;
    }

    private _blueTeamVoiceChannel: VoiceChannel | undefined;

    get blueTeamVoiceChannel(): VoiceChannel | undefined {
        return this._blueTeamVoiceChannel;
    }

    set blueTeamVoiceChannel(value: VoiceChannel | undefined) {
        this._blueTeamVoiceChannel = value;
    }

    private _countdown: number;

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

    readyCheckTimer() {
        setTimeout(async () => {
            if (!activePugs.find(ap => ap === this) || !!this._redTeamVoiceChannel) {
                this._countdown = 24;
                return;
            }
            if (this._countdown < 1 && !!this._players.find(p => !p.isReady)) {
                let readyPlayers = this._players.filter(p => p.isReady);
                if (queuedUsers.length + (matchSize - readyPlayers.length) < matchSize) {
                    readyPlayers.forEach(rp => queuedUsers.push(rp.user));
                    const usernamesOrNicknames: string[] = this._players
                        .filter(p => !p.isReady)
                        .map(nrp => {
                            const nickname: string | null | undefined = guild.members.cache.find(
                                m => m.user.id === nrp.user.id
                            )?.nickname;
                            return !!nickname ? nickname : !!nrp.user.username ? nrp.user.username : "";
                        });
                    await SendFailedReadyCheckDirectMessages(
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
                        this._players.push({user: queuedUser, isReady: false});
                        queuedUsers.splice(queuedUsers.indexOf(queuedUser), 1);
                        if (i === (matchSize - 1)) {
                            await this.message.edit({
                                embeds: [ReadyCheckEmbed(this.players)]
                            });
                            await pugQueueBotMessage.edit({
                                embeds: [MapPoolEmbed(), QueueEmbed()]
                            });
                        }
                    }
                }
                this._countdown = 24;
            }
            this._countdown -= 1;
            this.readyCheckTimer();
        }, (5 * 1000));
    }

}
