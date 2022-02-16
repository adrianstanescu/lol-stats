import { Fragment, ReactNode } from 'react';

import { UserReport } from '../../types/common';
import { useAggregate } from '../../hooks/usePreferences';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';

interface Props {
    user: UserReport;
}

export default function Spells({ user }: Props) {
    const spells = Object.keys(user.Stats.Spells) as (keyof typeof user.Stats.Spells)[];
    const values = useAggregate(
        spells.map((s) => user.Stats.Spells[s]),
        user
    );
    const total = values.reduce((acc, v) => acc + v);

    const max = spells.reduce((a, b) => (user.Stats.Spells[a] > user.Stats.Spells[b] ? a : b));
    const maxIndex = spells.findIndex((s) => s === max);

    return (
        <Stat
            primary={
                <Fragment>
                    Spammed <kbd>{max}</kbd> <FormattedNumber value={values[maxIndex]} /> times
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber value={total} /> spells cast
                </Fragment>
            }
            details={
                <Fragment>
                    {spells.slice(0, 4).map<ReactNode>((s, i) => (
                        <span key={s}>
                            <kbd>{s}</kbd> <FormattedNumber value={values[i]} />
                        </span>
                    )).reduce((acc, el) => [acc, ', ', el])}
                    <br />
                    {spells.slice(4).map<ReactNode>((s, i) => (
                        <span key={s}>
                            <kbd>{s}</kbd> <FormattedNumber value={values[i]} />
                        </span>
                    )).reduce((acc, el) => [acc, ', ', el])}
                </Fragment>
            }
        />
    );
}
