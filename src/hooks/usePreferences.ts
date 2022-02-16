import { atom, useRecoilState } from 'recoil';
import { UserReport } from '../types/common';

export enum AggregateType {
    Total = 'Total',
    PerGame = 'PerGame',
    PerMinute = 'PerMinute',
}

interface Preferences {
    aggregateType: AggregateType;
}

export const DEFAULT_PREFERENCES: Preferences = {
    aggregateType: AggregateType.Total,
};

export const preferencesState = atom<Preferences>({
    key: 'preferencesState',
    default: DEFAULT_PREFERENCES,
});

export function useAggregateType() {
    const [preferences, setPreferences] = useRecoilState(preferencesState);
    const setAggregateType = (t: AggregateType) => {
        setPreferences((prev) => {
            return {
                ...prev,
                aggregateType: t
            }
        });
    };
    return [preferences.aggregateType, setAggregateType] as const;
}

function aggregate(values: number[], minutes: number, games: number, aggregateType: AggregateType): number[] {
    if (aggregateType === AggregateType.PerGame) {
        return values.map(v => v / games);
    }
    if (aggregateType === AggregateType.PerMinute) {
        return values.map(v => v / minutes);
    }
    return values;
}

export function useAggregate<T extends number | number[]>(value: T, user: UserReport): T {
    const [aggregateType] = useAggregateType();
    const games = user.Wins + user.Losses;
    const minutes = user.Duration / 60;

    if (Array.isArray(value)) {
        return aggregate(value, minutes, games, aggregateType) as T;
    }
    const [ singleValue ] = aggregate([value], minutes, games, aggregateType);
    return singleValue as T;
}