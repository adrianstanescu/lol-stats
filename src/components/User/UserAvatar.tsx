import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { UserReport } from '../../types/common';
import styles from './UserAvatar.module.css';
import { useDataDragonVersion } from '../../hooks/useReport';
import IconButton from '../common/IconButton';
import StarIcon from '../icons/StarIcon';
import { usePrimaryUserID } from '../../hooks/usePreferences';

interface Props {
    id: string;
    variant: 'heading';
    user: UserReport;
    index: number;
}
export default function UserAvatar({ variant, user, index, id }: Props) {
    const dataDragonVersion = useDataDragonVersion();
    const [primaryUserID, setPrimaryUserID] = usePrimaryUserID();
    const [summonerIndex, setSummonerIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setSummonerIndex((prev) => (prev < user.Summoners.length - 1 ? prev + 1 : 0));
        }, 60_000);
        return () => clearInterval(interval);
    });
    const handleSetPrimary = () => {
        setPrimaryUserID(id);
    };
    return (
        <div className={styles.container}>
            {user.Summoners.map((summoner, i) => (
                <div
                    key={i}
                    className={clsx(styles.icon, {
                        [styles.selected]: summonerIndex === i,
                    })}
                >
                    <img
                        alt="Icon"
                        width={300}
                        height={300}
                        src={`/dd/${dataDragonVersion}/img/profileicon/${summoner.Icon}`}
                    />
                    <code
                        className={styles.level}
                        style={{ backgroundColor: `var(--palette-pastel-${index + 1})` }}
                    >
                        {summoner.Level}
                    </code>
                    <div
                        className={clsx(styles.primaryToggle, {
                            [styles.isPrimary]: primaryUserID === id,
                        })}
                    >
                        <IconButton active={primaryUserID === id} onClick={handleSetPrimary}>
                            <StarIcon />
                        </IconButton>
                    </div>
                    <div className={styles.name}>{summoner.Name}</div>
                </div>
            ))}
            <div className={styles.name}>{user.Name}</div>
        </div>
    );
}
