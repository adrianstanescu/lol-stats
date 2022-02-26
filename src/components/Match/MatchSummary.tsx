import { MainReport, MatchSummary } from '../../types/common';
import FormattedNumber from '../common/FormattedNumber';
import MatchResultComponent from '../common/MatchResult';
import MatchUserSummaryComponent from './MatchUserSummary';

import styles from './MatchSummary.module.css';
import { useState } from 'react';
import clsx from 'clsx';

interface Props {
    match: MatchSummary;
    userIDs: string[];
    report: MainReport;
    isNew: boolean;
}

export default function MatchSummaryComponent({ match, userIDs, report, isNew }: Props) {
    const date = new Date(match.CreatedAt);
    const [expanded, setExpanded] = useState(false);

    const handleRowClick = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <div
            className={clsx(styles.row, { [styles.expanded]: expanded, [styles.new]: isNew })}
            onClick={handleRowClick}
        >
            <div className={styles.timeColumn}>
                <FormattedNumber variant="duration" value={match.Duration} />
                <div className={styles.time}>
                    <code>{date.toLocaleTimeString()}</code>
                </div>
            </div>
            <div className={styles.resultColumn}>
                <MatchResultComponent result={match.Result} map={match.Map} />
            </div>
            {userIDs.map((userID) =>
                match.Users[userID] ? (
                    <MatchUserSummaryComponent
                        key={userID}
                        summary={match.Users[userID]}
                        report={report}
                        variant={expanded ? 'full' : 'compact'}
                    />
                ) : (
                    <div key={userID} />
                )
            )}
        </div>
    );
}
