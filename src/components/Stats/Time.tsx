import { Fragment } from 'react';

import { UserReport } from '../../types/common';
import { useAggregate } from '../../hooks/usePreferences';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';

interface Props {
    user: UserReport;
}

export default function Time({ user }: Props) {
    const [dead, total] = useAggregate([user.Stats.Misc.TotalTimeSpentDead, user.Duration], user);
    return (
        <Stat
            primary={
                <Fragment>
                    <FormattedNumber variant="duration" value={dead} /> spent dead
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber variant="percent" value={dead / total} /> of{' '}
                    <FormattedNumber variant="duration" value={total} /> game time
                </Fragment>
            }
        />
    );
}
