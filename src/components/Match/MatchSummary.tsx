import { MainReport, MatchSummary } from '../../types/common';
import FormattedNumber from '../common/FormattedNumber';
import MatchResultComponent from '../common/MatchResult';
import MatchUserSummaryComponent from './MatchUserSummary';

interface Props {
    match: MatchSummary;
    userIDs: string[];
    report: MainReport;
}

export default function MatchSummaryComponent({ match, userIDs, report }: Props) {
    const date = new Date(match.CreatedAt);
    return (
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
                        <MatchUserSummaryComponent summary={match.Users[userID]} report={report} />
                    )}
                </td>
            ))}
        </tr>
    );
}
