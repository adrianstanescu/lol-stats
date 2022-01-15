import {
    MainReport,
    MatchReport,
    MatchResult,
    MatchSummary,
    MatchUserSummary,
    UserReport,
} from '../../types/common';
import { EMPTY_MATCH_STATS } from '../constants';
import { User } from './user';
import { aggregateAwards, aggregateStats, combinations } from '../utils';
import { configUsers } from '../config';

export class MainReportBuilder implements MainReport {
    public Users: {
        [id: string]: UserReport;
    } = {};
    public Matches: MatchSummary[] = [];

    public Venn: { key: string[]; data: number }[] = [];

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
    }

    addMatch(match: MatchReport) {
        if (this.Matches.find((m) => m.ID === match.ID)) {
            return;
        }

        // if more than one user, only use matches with at least two users
        if (configUsers().length > 1 && Object.keys(match.Users).length < 2) {
            return;
        }
        const summaries: { [id: string]: MatchUserSummary } = {};
        for (const id of Object.keys(match.Users)) {
            if (!this.Users[id]) {
                throw new Error('User not found');
            }
            if (match.Result === MatchResult.Win) {
                this.Users[id].Wins += 1;
            } else {
                this.Users[id].Losses += 1;
            }
            this.Users[id].Duration += match.Duration;
            this.Users[id].Stats = aggregateStats(this.Users[id].Stats, match.Users[id].Stats);
            this.Users[id].Awards = aggregateAwards(this.Users[id].Awards, match.Users[id].Awards);

            summaries[id] = {
                CS: match.Users[id].Stats.CS,
                Champion: match.Users[id].Champion,
                Champions: match.Users[id].Stats.Champions,
            };
        }
        // const users = Object.fromEntries(Object.entries(match.Users).map([id, stats])
        this.Matches.push({
            ID: match.ID,
            CreatedAt: match.CreatedAt,
            Duration: match.Duration,
            Result: match.Result,
            Users: summaries,
        });

        const vennKeys = combinations(...Object.keys(match.Users).sort());
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
}
