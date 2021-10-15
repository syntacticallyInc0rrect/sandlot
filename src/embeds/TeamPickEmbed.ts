import {MessageEmbed, MessageEmbedOptions, PartialUser, User} from "discord.js";
import {memberNicknameMention} from "@discordjs/builders";
import {authorIconUrl, thumbnailUrl} from "../state/state";
import {usernameOrNickname} from "../helpers/usernameOrNickname";
import {PickupGame} from "../classes/PickupGame";

export const TeamPickEmbed = (pug: PickupGame, captain: User | PartialUser | undefined): MessageEmbed => {
    const props: MessageEmbedOptions = {
        title: `Pick Teams`,
        description: !!captain ? `${usernameOrNickname(captain)}, it's your pick!` : 'There are no Captain\'s',
        thumbnail: {url: thumbnailUrl},
        fields: [
            {
                name: `Insurgents`,
                value: pug.redTeam.length < 1 ?
                    'waiting on first player' :
                    pug.redTeam.map(p => `${memberNicknameMention(p.id)}  ${pug.redTeamCaptain === p ? '⭐' : ''}`)
                    .toString()
                    .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            },
            {
                name: 'Security',
                value: pug.blueTeam.length < 1 ?
                    'waiting on first player' :
                    pug.blueTeam.map(p => `${memberNicknameMention(p.id)}  ${pug.blueTeamCaptain === p ? '⭐' : ''}`)
                        .toString()
                        .replace(/\s*,\s*|\s+,/g, "\n"),
                inline: false
            },
            {
                name: "Available Players",
                value: pug.players
                    .filter(p => !pug.redTeam.find(rtp => rtp === p.user) && !pug.blueTeam.find(btp => btp === p.user)).length < 1 ?
                    'no more available players' :
                    `${pug.players
                        .filter(p => !pug.redTeam.find(rtp => rtp === p.user) && !pug.blueTeam.find(btp => btp === p.user))
                        .map(player => memberNicknameMention(player.user.id))
                        .toString()
                        .replace(/\s*,\s*|\s+,/g, "\n")
                }`,
                inline: false
            }
        ]
        ,
        footer: {
            text: "Who's playing who?",
            icon_url: authorIconUrl
        }
    };
    return new MessageEmbed(props);
};
