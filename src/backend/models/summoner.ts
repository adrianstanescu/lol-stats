import { getMatchIDs } from '../riot/api';
import { SummonerAccount } from '../../types/backend';
import { SummonerReport } from '../../types/common';
import { Server } from '../../types/riot';

export class Summoner {
    public server: Server;
    public id = '';
    public accountId = '';
    public puuid = '';
    public name = '';
    public profileIconId?: number;
    public revisionDate?: number;
    public summonerLevel = 0;

    constructor(account: SummonerAccount, data: Partial<Summoner>) {
        this.server = account.server;
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
}
