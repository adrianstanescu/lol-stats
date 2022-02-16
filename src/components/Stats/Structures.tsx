import { Fragment } from 'react';

import { UserReport } from '../../types/common';
import { useAggregate, useAggregateType } from '../../hooks/usePreferences';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';
import TowerIcon from '../icons/TowerIcon';

interface Props {
    user: UserReport;
}

export default function Structures({ user }: Props) {
    const [aggregateType] = useAggregateType();
    const [iK, tK, nK, iA, tA, nA] = useAggregate(
        [
            user.Stats.Score.Inhibitor.Kills,
            user.Stats.Score.Turret.Kills,
            user.Stats.Score.Nexus.Kills,
            user.Stats.Score.Inhibitor.Assists,
            user.Stats.Score.Turret.Assists,
            user.Stats.Score.Nexus.Assists,
        ],
        user
    );
    const totalKills = iK + tK + nK;
    const totalAssists = iA + tA + nA;
    return (
        <Stat
            primary={
                <Fragment>
                    <FormattedNumber aggregateType={aggregateType} value={totalKills} /> structures destroyed
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber aggregateType={aggregateType} value={totalAssists} /> assists
                </Fragment>
            }
            details={
                <Fragment>
                    <TowerIcon /><FormattedNumber aggregateType={aggregateType} value={tK + tA} /> turrets,{' '}
                    <FormattedNumber aggregateType={aggregateType} value={iK + iA} /> inhibitors,{' '}
                    <FormattedNumber aggregateType={aggregateType} value={nK + nA} /> nexuses
                </Fragment>
            }
        />
    );
}
