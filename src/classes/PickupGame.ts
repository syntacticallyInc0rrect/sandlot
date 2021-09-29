import {CategoryChannel, Message, PartialUser, TextChannel, User, VoiceChannel} from "discord.js";

export class PickupGame {
    private readonly _id: number;
    private readonly _players: (User | PartialUser)[];
    private readonly _category: CategoryChannel;
    private readonly _textChannel: TextChannel;
    private readonly _voiceChannel: VoiceChannel;
    private readonly _message: Message;
    private _redTeam: (User | PartialUser)[] = [];
    private _blueTeam: (User | PartialUser)[] = [];
    private _redTeamVoiceChannel: VoiceChannel | undefined;
    private _blueTeamVoiceChannel: VoiceChannel | undefined;

    constructor(
        id: number,
        players: (User | PartialUser)[],
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
    }

    get id(): number {
        return this._id;
    }

    get players(): (User | PartialUser)[] {
        return this._players;
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

}
