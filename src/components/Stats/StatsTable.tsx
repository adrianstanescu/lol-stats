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

interface Props {
    users: { [id: string]: UserReport };
}

const SECTIONS = [
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
    return (
        <table>
            <thead>
                <tr>
                    <th />
                    {Object.keys(users).map((id) => (
                        <th key={id}>
                            <UserAvatar key={id} variant="heading" user={users[id]} />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {SECTIONS.map(({ key, label, Component }) => (
                    <tr key={key}>
                        <th>{label}</th>
                        {Object.keys(users).map((id) => (
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
