import { Fragment } from 'react';

import { UserReport } from '../../types/common';
import { useAggregate } from '../../hooks/usePreferences';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';

interface Props {
    user: UserReport;
}

export default function Gold({ user }: Props) {
    const [spent, earned, items] = useAggregate(
        [user.Stats.Misc.GoldSpent, user.Stats.Misc.GoldEarned, user.Stats.Misc.ItemsPurchased],
        user
    );
    return (
        <Stat
            primary={
                <Fragment>
                    <FormattedNumber value={spent} /> gold spent
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber value={earned} /> gold earned
                </Fragment>
            }
            details={
                <Fragment>
                    <FormattedNumber value={items} /> items purchased
                </Fragment>
            }
        />
    );
}
