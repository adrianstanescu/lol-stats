import { getMatchIDs } from '../riot/api';
import { SummonerAccount } from '../../types/backend';
import { SummonerReport } from '../../types/common';
import { Server } from '../../types/riot';
import { configUsers } from '../config';
import { User } from './user';

export class Summoner {
    public server: Server;
    public userId = '';
    public id = '';
    public accountId = '';
    public puuid = '';
    public name = '';
    public profileIconId?: number;
    public revisionDate?: number;
    public summonerLevel = 0;

    constructor(account: SummonerAccount, data: Partial<Summoner>) {
        this.server = account.server;
        this.userId = account.userId;
        Object.assign(this, data);
    }

    getMatchIDs() {
        return getMatchIDs(this.puuid);
    }

    getReport(): SummonerReport {
        return {
            Name: this.name,
            Icon: `${this.profileIconId}.png`,
            Level: this.summonerLevel,
        };
    }

    static getAll() {
        return summoners;
    }
}

let summoners: Summoner[] = [];
let summonersLoaded = false;
export async function loadSummoners() {
    if (summonersLoaded) {
        return;
    }
    const users = configUsers().map((u) => new User(u));

    for (const user of users) {
        for (const summoner of await user.getSummoners()) {
            summoners.push(summoner);
        }
    }
    
    summonersLoaded = true;
}