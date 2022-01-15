import { AggregateType } from '../hooks/preferences';

export const FRACTION_DIGITS_BY_AGGREGATE_TYPE = {
    [AggregateType.Total]: 0,
    [AggregateType.PerGame]: 3,
    [AggregateType.PerMinute]: 4,
};
