import hash from 'object-hash';
import {
    MainReport,
    MatchResult,
    MatchSummary,
    MatchUserSummary,
    MetaChampion,
    UserReport,
} from '../../types/common';
import { EMPTY_MATCH_STATS } from '../constants';
import { User } from './user';
import { aggregateAwards, aggregateStats, combinations } from '../utils';
import { configUsers, datadragonVersion } from '../config';
import { getMetaChampion } from '../meta';
import { Match } from './match';

export class MainReportBuilder implements MainReport {
    public Users: {
        [id: string]: UserReport;
    } = {};
    public Matches: MatchSummary[] = [];

    public Venn: { key: string[]; data: number }[] = [];
    public Meta: {
        Champions: { [key: string]: MetaChampion };
        DataDragonVersion: string;
        CreatedAt: Date;
    } = {
        Champions: {},
        DataDragonVersion: datadragonVersion(),
        CreatedAt: new Date(),
    };

    private users: User[] = [];
    private processedMatchIDs = new Set<string>();

    async addUser(user: User) {
        const summoners = await user.getSummoners();
        const summonerReports = summoners.map((s) => s.getReport());
        this.Users[user.id] = {
            Name: user.name,
            Wins: 0,
            Losses: 0,
            Duration: 0,
            Stats: EMPTY_MATCH_STATS,
            Summoners: summonerReports,
            Awards: {},
        };
        this.users.push(user);
    }

    addMatch(match: Match) {
        if (this.processedMatchIDs.has(match.id)) {
            return;
        }
        this.processedMatchIDs.add(match.id);
        if (!match.isValid()) {
            return;
        }

        const matchReport = match.getReport();

        // if more than one user, only use matches with at least two users
        if (configUsers().length > 1 && Object.keys(matchReport.Users).length < 2) {
            return;
        }
        const summaries: { [id: string]: MatchUserSummary } = {};
        for (const id of Object.keys(matchReport.Users)) {
            if (!this.Users[id]) {
                throw new Error('User not found');
            }
            if (matchReport.Result === MatchResult.Win) {
                this.Users[id].Wins += 1;
            } else {
                this.Users[id].Losses += 1;
            }
            this.Users[id].Duration += matchReport.Duration;
            this.Users[id].Stats = aggregateStats(
                this.Users[id].Stats,
                matchReport.Users[id].Stats
            );
            this.Users[id].Awards = aggregateAwards(
                this.Users[id].Awards,
                matchReport.Users[id].Awards
            );

            summaries[id] = {
                CS: matchReport.Users[id].Stats.CS,
                Gold: matchReport.Users[id].Stats.Misc.GoldEarned,
                Champion: matchReport.Users[id].Champion,
                Champions: matchReport.Users[id].Stats.Score.Champion,
            };
            if (this.Meta.Champions[matchReport.Users[id].Champion] === undefined) {
                this.Meta.Champions[matchReport.Users[id].Champion] = getMetaChampion(
                    matchReport.Users[id].Champion
                );
            }
        }
        // const users = Object.fromEntries(Object.entries(matchReport.Users).map([id, stats])
        this.Matches.push({
            ID: matchReport.ID,
            CreatedAt: matchReport.CreatedAt,
            Duration: matchReport.Duration,
            Map: matchReport.Map,
            Result: matchReport.Result,
            Users: summaries,
        });

        const vennKeys = combinations(...Object.keys(matchReport.Users).sort());
        for (const vennKey of vennKeys) {
            const existingVenn = this.Venn.findIndex((v) => v.key.join('-') === vennKey.join('-'));
            if (existingVenn !== -1) {
                this.Venn[existingVenn].data += 1;
            } else {
                this.Venn.push({
                    key: vennKey,
                    data: 1,
                });
            }
        }
    }

    sortMatches() {
        this.Matches.sort((a, b) => b.CreatedAt - a.CreatedAt);
    }

    toJSON() {
        return {
            Matches: this.Matches,
            Meta: this.Meta,
            Users: this.Users,
            Venn: this.Venn,
            Hash: this.getHash(),
        };
    }

    getUsers() {
        return this.users;
    }

    getHash(): string {
        return hash({
            Matches: this.Matches,
            Users: this.Users,
        });
    }

    matchWasProcessed(matchID: string): boolean {
        return this.processedMatchIDs.has(matchID);
    }
}
