import { Fragment } from 'react';
import { MainReport, MatchSummary } from '../../types/common';
import FormattedNumber from '../common/FormattedNumber';
import MatchResultComponent from '../common/MatchResult';
import MatchUserSummaryComponent from './MatchUserSummary';

interface Props {
    match: MatchSummary;
    previousMatch?: MatchSummary;
    userIDs: string[];
    report: MainReport;
}

export default function MatchSummaryComponent({ match, userIDs, report, previousMatch }: Props) {
    const date = new Date(match.CreatedAt);
    const sessionDate = new Date(date.getTime());
    sessionDate.setHours(sessionDate.getHours() - 8);
    const prevSessionDate = new Date(previousMatch?.CreatedAt ?? 0);
    prevSessionDate.setHours(prevSessionDate.getHours() - 8);
    return (
        <Fragment>
            {prevSessionDate.toLocaleDateString() !== sessionDate.toLocaleDateString() && (
                <tr>
                    <td colSpan={2} style={{ position: 'sticky', top: 130, textAlign: 'center', backgroundColor: 'var(--background-default)' }}>
                        <code>{date.toLocaleDateString()}</code>
                    </td>
                    <td colSpan={2 + userIDs.length} />
                </tr>
            )}
            <tr>
                <td>
                    <div style={{ color: 'var(--text-color-secondary)' }}>
                        <code>{date.toLocaleTimeString()}</code>
                    </div>
                </td>
                <td>
                    <FormattedNumber variant="duration" value={match.Duration} />
                </td>
                <td>
                    <MatchResultComponent result={match.Result} map={match.Map} />
                </td>
                {userIDs.map((userID) => (
                    <td key={userID}>
                        {match.Users[userID] && (
                            <MatchUserSummaryComponent
                                summary={match.Users[userID]}
                                report={report}
                            />
                        )}
                    </td>
                ))}
            </tr>
        </Fragment>
    );
}
