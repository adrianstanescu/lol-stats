import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { UserReport } from '../../types/common';
import styles from './UserAvatar.module.css';
import { useDataDragonVersion } from '../../hooks/report';

interface Props {
    variant: 'heading';
    user: UserReport;
}
export default function UserAvatar({ variant, user }: Props) {
    const dataDragonVersion = useDataDragonVersion();
    const [summonerIndex, setSummonerIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setSummonerIndex((prev) =>
                prev < user.Summoners.length - 1 ? prev + 1 : 0
            );
        }, 60_000);
        return () => clearInterval(interval);
    });
    return (
        <div className={styles.container}>
            {user.Summoners.map((summoner, i) => (
                <div
                    key={i}
                    className={clsx(styles.icon, {
                        [styles.selected]: summonerIndex === i,
                    })}
                >
                    <img alt="Icon" width={300} height={300} src={`/dd/${dataDragonVersion}/img/profileicon/${summoner.Icon}`} />
                    <code className={styles.level}>{summoner.Level}</code>
                    <div className={styles.name}>{summoner.Name}</div>
                </div>
            ))}
            <div className={styles.name}>{user.Name}</div>
        </div>
    );
}
