import { Fragment } from 'react';
import { MainReport, MatchSummaryGroup } from '../../types/common';
import FormattedNumber from '../common/FormattedNumber';
import MatchSummary from './MatchSummary';
import styles from './MatchSummaryGroup.module.css';

interface Props {
    group: MatchSummaryGroup;
    userIDs: string[];
    report: MainReport;
}

export default function MatchSummaryGroupComponent({ group, userIDs, report }: Props) {
    return (
        <Fragment>
            <tr className={styles.summaryRow}>
                <td
                    colSpan={2}
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <code>{group.Date}</code>
                </td>
                <td />
                {userIDs.map((id) => (
                    <td key={id}>
                        {group.KDA[id] && (
                            <table className={styles.groupStats}>
                                <thead>
                                    <tr>
                                        <th />
                                        <th>Session</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>KDA</th>
                                        <td>
                                            {group.KDA[id] && (
                                                <FormattedNumber value={group.KDA[id]} />
                                            )}
                                        </td>
                                        <td>
                                            {group.TotalKDA[id] && (
                                                <FormattedNumber value={group.TotalKDA[id]} />
                                            )}
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
                                            {group.WinRate[id] && (
                                                <FormattedNumber
                                                    variant="percent"
                                                    value={group.WinRate[id]}
                                                />
                                            )}
                                        </td>
                                        <td>
                                            {group.TotalWinRate[id] && (
                                                <FormattedNumber
                                                    variant="percent"
                                                    value={group.TotalWinRate[id]}
                                                />
                                            )}
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
                    </td>
                ))}
                <td colSpan={1 + userIDs.length} />
            </tr>
            {group.Matches.slice().reverse().map((match, i) => (
                <MatchSummary key={match.ID} match={match} userIDs={userIDs} report={report} />
            ))}
        </Fragment>
    );
}
