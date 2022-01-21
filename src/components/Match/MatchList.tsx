import { MainReport } from '../../types/common';
import UserAvatar from '../User/UserAvatar';
import MatchSummary from './MatchSummary';
import styles from './MatchList.module.css';
import ClockIcon from '../icons/ClockIcon';

interface Props {
    report: MainReport;
}
export default function MatchList({ report }: Props) {
    const userIDs = Object.keys(report.Users);
    // TODO: add virtualization
    return (
        <table className={styles.matchList}>
            <thead>
                <tr>
                    <th colSpan={2}>
                        <ClockIcon />
                    </th>
                    <th />
                    {userIDs.map((id) => (
                        <th key={id}>
                            <UserAvatar key={id} variant="heading" user={report.Users[id]} />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {report.Matches.map((match, i) => (
                    <MatchSummary
                        key={match.ID}
                        match={match}
                        userIDs={userIDs}
                        report={report}
                        previousMatch={i > 0 ? report.Matches[i - 1] : undefined}
                    />
                ))}
            </tbody>
        </table>
    );
}
