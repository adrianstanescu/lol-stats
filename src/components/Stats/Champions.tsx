import { Fragment, ReactNode } from 'react';

import { ChampionClassType, UserReport } from '../../types/common';
import ChampionClass from '../common/ChampionClass';
import FormattedNumber from '../common/FormattedNumber';
import Stat from './Stat';

interface Props {
    user: UserReport;
}

export default function Champions({ user }: Props) {
    const favoriteChampion = Object.keys(user.Stats.Champions).sort(
        (a, b) => user.Stats.Champions[b] - user.Stats.Champions[a]
    )[0];
    const classes = (Object.keys(user.Stats.Classes) as ChampionClassType[]).sort(
        (a, b) => (user.Stats.Classes[b] ?? 0) - (user.Stats.Classes[a] ?? 0)
    );
    return (
        <Stat
            primary={
                <Fragment>
                    <FormattedNumber
                        value={user.Stats.Champions[favoriteChampion]}
                        fractionDigits={0}
                    />{' '}
                    games as <code>{favoriteChampion}</code>
                </Fragment>
            }
            secondary={
                <Fragment>
                    <FormattedNumber
                        value={Object.keys(user.Stats.Champions).length}
                        fractionDigits={0}
                    />{' '}
                    different champions
                </Fragment>
            }
            details={
                <Fragment>
                    {classes.slice(0, 3).map((c) => (
                        <span key={c}>
                            <FormattedNumber
                                value={user.Stats.Classes[c] ?? 0}
                                fractionDigits={0}
                            />{' '}
                            <ChampionClass value={c} />,{' '}
                        </span>
                    ))}
                    <br />
                    {classes
                        .slice(3)
                        .map<ReactNode>((c) => (
                            <span key={c}>
                                <FormattedNumber
                                    value={user.Stats.Classes[c] ?? 0}
                                    fractionDigits={0}
                                />{' '}
                                <ChampionClass value={c} />
                            </span>
                        ))
                        .reduce((acc, el) => [acc, ', ', el])}
                </Fragment>
            }
        />
    );
}
