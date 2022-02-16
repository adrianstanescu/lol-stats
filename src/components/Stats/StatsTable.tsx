import { UserReport } from '../../types/common';
import UserAvatar from '../User/UserAvatar';

import styles from './StatsTable.module.css';

import Games from './Games';
import Score from './Score';
import Offense from './Offense';
import Awards from './Awards';
import Spells from './Spells';
import Time from './Time';
import Gold from './Gold';
import Structures from './Structures';
import Champions from './Champions';
import { usePrimaryUserID } from '../../hooks/usePreferences';

interface Props {
    users: { [id: string]: UserReport };
}

const SECTIONS = [
    {
        key: 'champions',
        label: 'Champions',
        Component: Champions,
    },
    {
        key: 'awards',
        label: 'Awards',
        Component: Awards,
    },
    {
        key: 'games',
        label: 'Games',
        Component: Games,
    },
    {
        key: 'score',
        label: 'Score',
        Component: Score,
    },
    {
        key: 'offense',
        label: 'Offense',
        Component: Offense,
    },
    {
        key: 'spells',
        label: 'Spells',
        Component: Spells,
    },
    {
        key: 'time',
        label: 'Time',
        Component: Time,
    },
    {
        key: 'gold',
        label: 'Gold',
        Component: Gold,
    },
    {
        key: 'structures',
        label: 'Structures',
        Component: Structures,
    },
];

export default function StatsTable({ users }: Props) {
    const [primaryUserID] = usePrimaryUserID();
    const userIDs = Object.keys(users).sort((a, _) => (a === primaryUserID ? -1 : 0));
    return (
        <table>
            <thead>
                <tr>
                    <th />
                    {userIDs.map((id, index) => (
                        <th key={id}>
                            <UserAvatar
                                key={id}
                                id={id}
                                variant="heading"
                                user={users[id]}
                                index={index}
                            />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {SECTIONS.map(({ key, label, Component }) => (
                    <tr key={key}>
                        <th>{label}</th>
                        {userIDs.map((id) => (
                            <td key={id} className={styles.cell}>
                                <Component user={users[id]} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
