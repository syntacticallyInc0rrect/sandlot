import {PickupGame} from "../classes/PickupGame";
import {PugPlayer} from "../state/state";
import {PartialUser, User} from "discord.js";

export const assignRandomCaptains = (pug: PickupGame) => {
    let redTeamCaptain: (User | PartialUser);
    let blueTeamCaptain: (User | PartialUser);
    const volunteers: PugPlayer[] = pug.players.filter(pp => pp.isVolunteer);
    if (volunteers.length > 1) {
        const randomVolunteer = volunteers[Math.floor(Math.random() * volunteers.length)];
        redTeamCaptain = randomVolunteer.user;
        volunteers.splice(volunteers.indexOf(randomVolunteer), 1);
        blueTeamCaptain = volunteers[Math.floor(Math.random() * volunteers.length)].user;
    } else if (volunteers.length === 1) {
        redTeamCaptain = volunteers[0].user;
        const remainingPlayers: (User | PartialUser)[] = pug.players.map(p => p.user);
        remainingPlayers.splice(remainingPlayers.indexOf(redTeamCaptain), 1);
        blueTeamCaptain = remainingPlayers[Math.floor(Math.random() * volunteers.length)];
    } else {
        const players: PugPlayer[] = pug.players;
        const firstTeamCaptain = players[Math.floor(Math.random() * players.length)];
        players.splice(players.indexOf(firstTeamCaptain), 1);
        redTeamCaptain = firstTeamCaptain.user;
        blueTeamCaptain = players[Math.floor(Math.random() * players.length)].user;
    }
    pug.redTeamCaptain = redTeamCaptain;
    pug.redTeam.push(redTeamCaptain);
    pug.blueTeamCaptain = blueTeamCaptain;
    pug.blueTeam.push(blueTeamCaptain);
};
