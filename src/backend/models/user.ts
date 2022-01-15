import { getMatch, getSummoner } from '../riot/api';
import { UserData } from '../../types/backend';
import { Summoner } from './summoner';

export class User {
    constructor(private data: UserData) {
    }

    getSummoners(): Promise<Summoner[]> {
        return Promise.all(
            this.data.accounts.map((account) => getSummoner(account)),
        );
    }

    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }

    async getMatchIDs() {
        const summoners = await this.getSummoners();
        const accountMatchIDs = await Promise.all(
            summoners.map((summoner) => summoner.getMatchIDs()),
        );
        return accountMatchIDs.flat();
    }

    async getMatches() {
        const matchIDs = await this.getMatchIDs();
        const matches = [];
        for (const matchID of matchIDs) {
            // TODO: find corrent region
            const match = await getMatch(matchID);
            matches.push(match);
        }
        return matches.filter((match) => match.isValid()).sort((a, b) =>
            (a.info?.gameCreation ?? 0) - (b.info?.gameCreation ?? 0)
        );
    }
}
