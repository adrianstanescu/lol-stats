import { Fragment } from 'react';

import { UserReport } from '../../types/common';
import { useAggregate } from '../../hooks/usePreferences';
import FormattedNumber from '../common/FormattedNumber';
import DamageComponent from '../common/Damage';
import Stat from './Stat';

interface Props {
    user: UserReport;
}

export default function Offense({ user }: Props) {
    const siegeDamage = useAggregate(user.Stats.Damage.Siege, user);
    return (
        <Stat
            primary={
                <Fragment>
                    <DamageComponent
                        variant="total"
                        damage={user.Stats.Damage.Champions}
                        user={user}
                    />{' '}
                    damage to champions
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber value={siegeDamage} /> siege damage
                </Fragment>
            }
            details={
                <DamageComponent
                    variant="separate"
                    damage={user.Stats.Damage.Champions}
                    user={user}
                />
            }
        />
    );
}
