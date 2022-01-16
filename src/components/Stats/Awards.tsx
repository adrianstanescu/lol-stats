import { Fragment } from 'react';

import { AwardSentiment, UserReport } from '../../types/common';
import { useAggregate, useAggregateType } from '../../hooks/preferences';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';
import { AWARDS } from '../../constants/awards';

interface Props {
    user: UserReport;
}

export default function Awards({ user }: Props) {
    const [aggregateType] = useAggregateType();
    const [totalAwards, positiveAwards, negativeAwards] = useAggregate(
        Object.entries(user.Awards).reduce(
            ([total, positive, negative], [type, count]) => {
                const sentiment = AWARDS.find((a) => a.type === type)?.sentiment;
                return [
                    total + count,
                    positive + (sentiment === AwardSentiment.Positive ? count : 0),
                    negative + (sentiment === AwardSentiment.Negative ? count : 0),
                ];
            },
            [0, 0, 0]
        ),
        user
    );
    const awards = Object.entries(user.Awards);
    awards.sort(([_, a], [__, b]) => b - a);
    const [favoriteType, count] = awards[0] ?? [undefined, 0];
    const favoriteCount = useAggregate(count, user);
    const favoriteAward = AWARDS.find((a) => a.type === favoriteType);
    return (
        <Stat
            primary={
                <Fragment>
                    <FormattedNumber value={totalAwards} aggregateType={aggregateType} /> total
                    awards
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber value={positiveAwards} aggregateType={aggregateType} />{' '}
                    positive awards,{' '}
                    <FormattedNumber value={negativeAwards} aggregateType={aggregateType} />{' '}
                    negative awards
                </Fragment>
            }
            details={
                <Fragment>
                    <FormattedNumber value={favoriteCount} aggregateType={aggregateType} />{' '}
                    {favoriteAward?.name}
                </Fragment>
            }
        />
    );
}
