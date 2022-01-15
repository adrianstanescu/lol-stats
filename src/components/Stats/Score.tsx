import { Fragment } from 'react';

import { UserReport } from '../../types/common';
import { useAggregate } from '../../hooks/preferences';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';

interface Props {
    user: UserReport;
}

export default function Score({ user }: Props) {
    const kda =
        (user.Stats.Champions.Kills + user.Stats.Champions.Assists) / user.Stats.Champions.Deaths;
    const cs = useAggregate(user.Stats.CS, user);
    const kills = useAggregate(user.Stats.Champions.Kills, user);
    const deaths = useAggregate(user.Stats.Champions.Deaths, user);
    const assists = useAggregate(user.Stats.Champions.Assists, user);
    return (
        <Stat
            primary={
                <Fragment>
                    <FormattedNumber value={kda} /> KDA
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber value={cs} /> CS
                </Fragment>
            }
            details={
                <Fragment>
                    <code>
                        <FormattedNumber value={kills} /> / <FormattedNumber value={deaths} /> /{' '}
                        <FormattedNumber value={assists} />
                    </code>
                </Fragment>
                // <code>
                //     {user.Stats.Champions.Kills}/{user.Stats.Champions.Deaths}/
                //     {user.Stats.Champions.Assists}
                // </code>
            }
        />
    );
}
