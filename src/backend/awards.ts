import { AwardType, MatchStats } from '../types/common';
import { totalDamage } from './utils';

type GetWinner = (participants: { [puuid: string]: MatchStats }) => string | null;

function simplePickWinner(
    select: 'first' | 'last',
    getAmountFn: (stats: MatchStats) => number,
    fallbackAmountFn?: (stats: MatchStats) => number
) {
    return (participants: { [puuid: string]: MatchStats }) => {
        const ps = Object.entries(participants);
        ps.sort(([_a, aStats], [_b, bStats]) => {
            const diff = getAmountFn(bStats) - getAmountFn(aStats);
            if (diff === 0) {
                if (fallbackAmountFn) {
                    return fallbackAmountFn(bStats) - fallbackAmountFn(aStats);
                }
            }
            return diff;
        });
        const [puuid] = select === 'first' ? ps[0] : ps[ps.length - 1];
        return puuid;
    };
}

const AWARDS: Partial<Record<AwardType, GetWinner>> = {
    [AwardType.Kenny]: simplePickWinner(
        'first',
        (stats) => stats.Champions.Deaths,
        (stats) => stats.Misc.TotalTimeSpentDead
    ),
    [AwardType.Buddhist]: simplePickWinner('last', (stats) => totalDamage(stats.Damage.Champions)),
    [AwardType.Bulwark]: simplePickWinner('first', (stats) =>
        totalDamage(stats.Defense.DamageTaken)
    ),
};

export function getMatchAwards(participants: { [puuid: string]: MatchStats }): {
    [puuid: string]: Partial<Record<AwardType, number>>;
} {
    let matchAwards: { [puuid: string]: Partial<Record<AwardType, number>> } = {};
    for (const [key, getWinner] of Object.entries(AWARDS)) {
        const type = key as AwardType;
        const winner = getWinner(participants);
        if (winner === null) {
            continue;
        }

        // TODO: mutating arguments is not cool :(
        participants[winner].AwardCount += 1;

        if (!matchAwards[winner]) {
            matchAwards[winner] = {};
        }
        matchAwards[winner][type] = (matchAwards[winner][type] ?? 0) + 1;
    }
    return matchAwards;
}
