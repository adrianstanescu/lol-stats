import { AwardType, MatchUser, MatchUserType } from '../types/common';
import { isDefined } from '../utils';
import { ItemSet } from './models/itemSet';
import { kdaValue, killParticipation, totalDamage } from './utils';

type GetWinner = (participants: { [puuid: string]: MatchUser }) => string | null;

function simplePickWinner(
    select: 'first' | 'last',
    getAmountFn: (stats: MatchUser) => number | number[] | undefined,
    hasWinnerFn?: (participants: { [puuid: string]: MatchUser }) => boolean
) {
    return (participants: { [puuid: string]: MatchUser }) => {
        if (hasWinnerFn !== undefined && !hasWinnerFn(participants)) {
            return null;
        }
        const values = Object.entries(participants)
            .map(([puuid, participant]) => {
                const amounts = getAmountFn(participant);
                if (amounts === undefined) {
                    return undefined;
                }
                return [Array.isArray(amounts) ? amounts : [amounts], puuid, participant] as const;
            })
            .filter(isDefined);
        values.sort(([aValues], [bValues]) => {
            const maxPriority = aValues.length;
            if (bValues.length !== maxPriority) {
                throw new Error('getAmountFn should return the same number of items');
            }
            for (let priority = 0; priority < maxPriority; priority++) {
                const diff = bValues[priority] - aValues[priority];
                if (diff > 0) {
                    return 1;
                } else if (diff < 0) {
                    return -1;
                }
            }
            return 0;
        });
        const [, puuid] = select === 'first' ? values[0] : values[values.length - 1];
        return puuid;
    };
}

const AWARDS: Partial<Record<AwardType, GetWinner>> = {
    [AwardType.Kenny]: simplePickWinner('first', ({ Stats }) => [
        Stats.Score.Champion.Deaths,
        Stats.Misc.TotalTimeSpentDead,
    ]),
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
    [AwardType.Trailblazer]: simplePickWinner('first', ({ Stats }) =>
        Stats.Firsts.TowerKill && Stats.Firsts.ChampionKill ? 1 : 0
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
    [AwardType.CombatMedic]: simplePickWinner('first', ({ Stats }) => Stats.Support.Heal),
    [AwardType.Dominator]: simplePickWinner('first', ({ Stats }) => [
        kdaValue(Stats.Score.Champion),
        killParticipation(Stats.Score.Champion),
    ]),
    [AwardType.Protector]: simplePickWinner('first', ({ Stats }) => Stats.Support.Shield),
    [AwardType.Finisher]: simplePickWinner('first', ({ Stats }) => [
        Stats.Score.Champion.Kills,
        Stats.MultiKills.Penta,
        Stats.MultiKills.Quadra,
        Stats.MultiKills.Triple,
        Stats.MultiKills.Double,
    ]),
    [AwardType.PainBringer]: simplePickWinner('first', ({ Stats }) =>
        totalDamage(Stats.Damage.Champions)
    ),
    [AwardType.SiegeMaster]: simplePickWinner('first', ({ Stats }) => Stats.Damage.Siege),
    [AwardType.CreepLover]: simplePickWinner('first', ({ Stats }) => Stats.CS),
    [AwardType.CrowdController]: simplePickWinner('first', ({ Stats }) => Stats.Support.CC),
    [AwardType.RichBitch]: simplePickWinner('first', ({ Stats }) => Stats.Misc.GoldEarned),
    [AwardType.AlQaeda]: simplePickWinner('first', ({ Stats }) => [
        Stats.Score.Turret.Kills + Stats.Score.Inhibitor.Kills + Stats.Score.Nexus.Kills,
        Stats.Damage.Siege,
    ]),
    [AwardType.PressingIntensifies]: simplePickWinner('first', ({ Stats }) =>
        Object.values(Stats.Spells).reduce((acc, count) => acc + count, 0)
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
