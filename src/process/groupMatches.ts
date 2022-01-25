import {
    MainReport,
    MatchResult,
    MatchSummary,
    MatchSummaryGroup,
    MatchUserSummary,
} from '../types/common';

interface Stats {
    kills: number;
    deaths: number;
    assists: number;
    wins: number;
    losses: number;
}

function addStats(stats: Stats, match: MatchSummary, userSummary: MatchUserSummary) {
    return {
        kills: (stats?.kills ?? 0) + userSummary.Champions.Kills,
        deaths: (stats?.deaths ?? 0) + userSummary.Champions.Deaths,
        assists: (stats?.assists ?? 0) + userSummary.Champions.Assists,
        wins: (stats?.wins ?? 0) + (match.Result === MatchResult.Win ? 1 : 0),
        losses: (stats?.losses ?? 0) + (match.Result === MatchResult.Loss ? 1 : 0),
    };
}
function statsToKDA(currentStats: { [id: string]: Stats }) {
    return Object.fromEntries(
        Object.entries(currentStats).map(([userID, stats]) => [
            userID,
            (stats.kills + stats.assists) / (stats.deaths || 1),
        ])
    );
}
function statsToWinRate(currentStats: { [id: string]: Stats }) {
    return Object.fromEntries(
        Object.entries(currentStats).map(([userID, stats]) => [
            userID,
            stats.wins / (stats.wins + stats.losses),
        ])
    );
}

export function groupMatches(report: MainReport) {
    const groups: MatchSummaryGroup[] = [];

    let currentStats: { [id: string]: Stats } = {};
    const totalStats: { [id: string]: Stats } = {};

    let currentGroup: MatchSummaryGroup | undefined;
    let previousMatch: MatchSummary | undefined;

    for (let i = report.Matches.length - 1; i >= 0; i--) {
        const match = report.Matches[i];
        const date = new Date(match.CreatedAt);

        // the session interval is between 8:00:00 AM and 7:59:59 AM
        const sessionDate = new Date(date.getTime());
        sessionDate.setHours(sessionDate.getHours() - 8);
        const prevSessionDate = new Date(previousMatch?.CreatedAt ?? 0);
        prevSessionDate.setHours(prevSessionDate.getHours() - 8);

        if (sessionDate.toLocaleDateString() !== prevSessionDate.toLocaleDateString()) {
            if (currentGroup) {
                console.log(currentStats);
                currentGroup.TotalKDA = statsToKDA(totalStats);
                currentGroup.KDA = statsToKDA(currentStats);
                currentGroup.TotalWinRate = statsToWinRate(totalStats);
                currentGroup.WinRate = statsToWinRate(currentStats);
                groups.push(currentGroup);
            }
            const nextGroup: MatchSummaryGroup = {
                Date: sessionDate.toLocaleDateString(),
                PreviousGroup: currentGroup,
                TotalKDA: {},
                KDA: {},
                TotalWinRate: {},
                WinRate: {},
                Matches: [],
            };
            currentGroup = nextGroup;
            currentStats = {};
        }

        for (const [userID, userSummary] of Object.entries(match.Users)) {
            currentStats[userID] = addStats(currentStats[userID], match, userSummary);
            totalStats[userID] = addStats(totalStats[userID], match, userSummary);
        }
        currentGroup?.Matches.push(match);

        previousMatch = match;
    }

    if (currentGroup) {
        currentGroup.TotalKDA = statsToKDA(totalStats);
        currentGroup.KDA = statsToKDA(currentStats);
        currentGroup.TotalWinRate = statsToWinRate(totalStats);
        currentGroup.WinRate = statsToWinRate(currentStats);
        groups.push(currentGroup);
    }

    return groups;
}
