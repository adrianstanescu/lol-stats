import { AwardType, MatchUser, MatchUserType } from '../types/common';
import { ItemSet } from './models/itemSet';
import { isDefined, totalDamage } from './utils';

type GetWinner = (participants: { [puuid: string]: MatchUser }) => string | null;

function simplePickWinner(
    select: 'first' | 'last',
    getAmountFn: (stats: MatchUser) => number | undefined,
    getFallbackAmountFn?: (stats: MatchUser) => number,
    hasWinnerFn?: (participants: { [puuid: string]: MatchUser }) => boolean
) {
    return (participants: { [puuid: string]: MatchUser }) => {
        if (hasWinnerFn !== undefined && !hasWinnerFn(participants)) {
            return null;
        }
        const values = Object.entries(participants)
            .map(([puuid, participant]) => {
                const amount = getAmountFn(participant);
                if (amount === undefined) {
                    return undefined;
                }
                return [puuid, amount, participant] as const;
            })
            .filter(isDefined);
        values.sort(([_a, a, aUser], [_b, b, bUser]) => {
            const diff = b - a;
            if (diff === 0) {
                if (getFallbackAmountFn) {
                    return getFallbackAmountFn(bUser) - getFallbackAmountFn(aUser);
                }
            }
            return diff;
        });
        const [puuid] = select === 'first' ? values[0] : values[values.length - 1];
        return puuid;
    };
}

const AWARDS: Partial<Record<AwardType, GetWinner>> = {
    [AwardType.Kenny]: simplePickWinner(
        'first',
        ({ Stats }) => Stats.Score.Champion.Deaths,
        ({ Stats }) => Stats.Misc.TotalTimeSpentDead
    ),
    [AwardType.Buddhist]: simplePickWinner('last', ({ Stats }) =>
        totalDamage(Stats.Damage.Champions)
    ),
    [AwardType.TreeHugger]: simplePickWinner('last', ({ Stats }) => Stats.Damage.Siege),
    [AwardType.ThriftShopper]: simplePickWinner(
        'last',
        ({ Items }) => {
            const itemSet = new ItemSet(Items);
            return itemSet.isFullBuild() ? itemSet.getFullBuildValue() : Infinity;
        },
        undefined,
        (participants) => {
            // at least 2 teammates must have a full build
            const allyFullBuilds = Object.values(participants)
                .filter((participant) => participant.Type === MatchUserType.Ally)
                .map((participant) => new ItemSet(participant.Items))
                .filter((itemSet) => itemSet.isFullBuild());
            return allyFullBuilds.length >= 2;
        }
    ),
    [AwardType.UnderpantsGnome]: simplePickWinner(
        'first',
        ({ Stats }) => Stats.Score.Champion.Kills + Stats.Score.Champion.Assists
    ),
    [AwardType.BavarianGod]: simplePickWinner(
        'first',
        ({ Stats }) =>
            (totalDamage(Stats.Damage.Champions) + Stats.Damage.Siege) / Stats.Misc.GoldSpent
    ),
    [AwardType.ScaredyPants]: simplePickWinner('last', ({ Stats }) => Stats.Score.Champion.Deaths),
    [AwardType.Thicc]: simplePickWinner(
        'first',
        ({ Stats }) => totalDamage(Stats.Defense.DamageTaken) / Stats.Score.Champion.Deaths
    ),
    [AwardType.Bulwark]: simplePickWinner('first', ({ Stats }) =>
        totalDamage(Stats.Defense.DamageTaken)
    ),
};

export function getMatchAwards(participants: { [puuid: string]: MatchUser }): {
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
        participants[winner].Stats.Awards += 1;

        if (!matchAwards[winner]) {
            matchAwards[winner] = {};
        }
        matchAwards[winner][type] = (matchAwards[winner][type] ?? 0) + 1;
    }
    return matchAwards;
}
