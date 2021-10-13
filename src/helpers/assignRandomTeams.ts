import {PickupGame} from "../classes/PickupGame";

export const assignRandomTeams = (pug: PickupGame) => {
    const players = pug.players.map(p => p.user);
    const totalPlayerCount = pug.players.length;
    const teamCount = totalPlayerCount / 2;
    for (let i = 0; i < teamCount; i++) {
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        pug.redTeam.push(randomPlayer);
        players.splice(players.indexOf(randomPlayer), 1);
    }
    pug.blueTeam = [...players];
};
