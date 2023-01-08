import { KDA, MainReport, MatchResult, MetaChampion } from '../types/common';

interface ChampionUserStats {
    Wins: number;
    Losses: number;
    KDA: KDA;
}

interface ChampionReportEntry extends MetaChampion {
    Key: string;
    Users: { [id: string]: ChampionUserStats };
}

type ChampionReport = ChampionReportEntry[];

function aggregateChampionUserStats(...stats: ChampionUserStats[]): ChampionUserStats | undefined {
    if (stats.length === 0) {
        return undefined;
    }
    return stats.reduce((acc, s) => ({
        Wins: acc.Wins + s.Wins,
        Losses: acc.Losses + s.Losses,
        KDA: {
            Kills: acc.KDA.Kills + s.KDA.Kills,
            Deaths: acc.KDA.Deaths + s.KDA.Deaths,
            Assists: acc.KDA.Assists + s.KDA.Assists,
        },
    }));
}

export function createChampionReport(report: MainReport): ChampionReport {
    const userIDs = Object.keys(report.Users);
    const championReport: ChampionReport = Object.entries(report.Meta.Champions).map(
        ([key, champion]) => ({
            ...champion,
            Key: key,
            Users: Object.fromEntries(
                userIDs
                    .map((userID) => {
                        return [
                            userID,
                            aggregateChampionUserStats(
                                ...report.Matches.filter(
                                    (match) => match.Users[userID]?.Champion === key
                                ).map((match) => ({
                                    Wins: match.Result === MatchResult.Win ? 1 : 0,
                                    Losses: match.Result === MatchResult.Loss ? 1 : 0,
                                    KDA: match.Users[userID].Champions,
                                }))
                            ),
                        ];
                    })
                    .filter(([_, stats]) => stats !== undefined)
            ),
        })
    );

    return championReport;
}
