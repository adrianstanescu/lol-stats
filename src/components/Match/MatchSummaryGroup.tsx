import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { MainReport, MatchResult, MatchSummaryGroup } from '../../types/common';
import FormattedNumber from '../common/FormattedNumber';
import MatchSummary from './MatchSummary';
import styles from './MatchSummaryGroup.module.css';

interface Props {
    group: MatchSummaryGroup;
    userIDs: string[];
    report: MainReport;
    newMatchIDs: Set<string>;
}

export default function MatchSummaryGroupComponent({ group, userIDs, report, newMatchIDs }: Props) {
    const [ref, isVisible] = useIntersectionObserver({
        rootMargin: '1000px',
        freezeOnceVisible: true,
    });
    if (!isVisible) {
        return (
            <div
                className={styles.wrapper}
                ref={ref}
                style={{ height: `calc(4rem + 10px + ${group.Matches.length * 4}em)` }}
            ></div>
        );
    }
    return (
        <div className={styles.wrapper} ref={ref}>
            <div className={styles.summaryRow}>
                <div className={styles.timeColumn}>
                    <code>{group.Date}</code>
                </div>
                <div className={styles.resultColumn}>
                    <code>
                        {group.Matches.filter((match) => match.Result === MatchResult.Win).length} W
                    </code>{' '}
                    <code>
                        {group.Matches.filter((match) => match.Result === MatchResult.Loss).length}{' '}
                        L
                    </code>
                </div>
                {userIDs.map((id) => (
                    <div key={id} className={styles.userColumn}>
                        {group.KDA[id] && (
                            <table className={styles.groupStats}>
                                <thead>
                                    <tr>
                                        <th />
                                        <th>Session</th>
                                        <th>Total</th>
                                        <th>Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>KDA</th>
                                        <td>
                                            <FormattedNumber value={group.KDA[id]} />
                                        </td>
                                        <td>
                                            <FormattedNumber value={group.TotalKDA[id]} />
                                        </td>
                                        <td>
                                            {group.PreviousGroup?.TotalKDA[id] && (
                                                <FormattedNumber
                                                    isDiff
                                                    fractionDigits={3}
                                                    value={
                                                        group.TotalKDA[id] -
                                                        group.PreviousGroup.TotalKDA[id]
                                                    }
                                                />
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Win rate</th>
                                        <td>
                                            <FormattedNumber
                                                variant="percent"
                                                value={group.WinRate[id]}
                                            />
                                        </td>
                                        <td>
                                            <FormattedNumber
                                                variant="percent"
                                                value={group.TotalWinRate[id]}
                                            />
                                        </td>
                                        <td>
                                            {group.PreviousGroup?.TotalWinRate[id] && (
                                                <FormattedNumber
                                                    variant="percent"
                                                    fractionDigits={3}
                                                    isDiff={true}
                                                    value={
                                                        group.TotalWinRate[id] -
                                                        group.PreviousGroup.TotalWinRate[id]
                                                    }
                                                />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.spacer} />
            {group.Matches.slice()
                .reverse()
                .map((match, i) => (
                    <MatchSummary
                        key={match.ID}
                        match={match}
                        userIDs={userIDs}
                        report={report}
                        isNew={newMatchIDs.has(match.ID)}
                    />
                ))}
        </div>
    );
}
