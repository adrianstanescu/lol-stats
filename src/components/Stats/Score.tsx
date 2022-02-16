import { Fragment } from 'react';

import { UserReport } from '../../types/common';
import { useAggregate } from '../../hooks/usePreferences';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';
import KDAComponent from '../common/KDA';
import CS from '../common/CS';

interface Props {
    user: UserReport;
}

export default function Score({ user }: Props) {
    const kda =
        (user.Stats.Score.Champion.Kills + user.Stats.Score.Champion.Assists) / user.Stats.Score.Champion.Deaths;
    const cs = useAggregate(user.Stats.CS, user);
    const Kills = useAggregate(user.Stats.Score.Champion.Kills, user);
    const Deaths = useAggregate(user.Stats.Score.Champion.Deaths, user);
    const Assists = useAggregate(user.Stats.Score.Champion.Assists, user);
    return (
        <Stat
            primary={
                <Fragment>
                    <FormattedNumber value={kda} /> KDA
                </Fragment>
            }
            secondary={
                <Fragment>
                    <CS value={cs} /> CS
                </Fragment>
            }
            details={
                <KDAComponent value={{Kills, Deaths, Assists}} />
            }
        />
    );
}
