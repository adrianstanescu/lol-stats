import { MainReport } from '../../types/common';
import UserAvatar from '../User/UserAvatar';
import { usePrimaryUserID } from '../../hooks/usePreferences';
import { useChampionReport } from '../../hooks/useReport';

import styles from './ChampionList.module.css';
import Champion from '../common/Champion';
import { Fragment } from 'react';
import KDAComponent from '../common/KDA';

interface Props {
    report: MainReport;
}
export default function ChampionList({ report }: Props) {
    const [primaryUserID] = usePrimaryUserID();
    const userIDs = Object.keys(report.Users).sort((a, _) => (a === primaryUserID ? -1 : 0));
    const championReport = useChampionReport();
    return (
        <div className={styles.wrapper}>
            <div className={styles.championList}>
                <div className={styles.header}>
                    <div />
                    {userIDs.map((id, index) => (
                        <div key={id}>
                            <UserAvatar
                                key={id}
                                id={id}
                                variant="heading"
                                user={report.Users[id]}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    {championReport &&
                        championReport.map((entry) => (
                            <div key={entry.Key} className={styles.row}>
                                <div>
                                    <Champion
                                        value={report.Meta.Champions[entry.Key]}
                                        variant="full"
                                    />
                                </div>
                                {userIDs.map((id, index) => (
                                    <div key={id} className={styles.stats}>
                                        {entry.Users[id] && (
                                            <Fragment>
                                                <KDAComponent
                                                    value={entry.Users[id].KDA}
                                                    fractionDigits={0}
                                                    totalGames={entry.Users[id].Wins + entry.Users[id].Losses}
                                                />
                                                <div>
                                                    <code>{entry.Users[id].Wins} W</code>{' '}
                                                    <code>{entry.Users[id].Losses} L</code>
                                                </div>
                                            </Fragment>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
