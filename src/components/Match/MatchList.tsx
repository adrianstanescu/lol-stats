import { MainReport } from '../../types/common';
import UserAvatar from '../User/UserAvatar';
import styles from './MatchList.module.css';
import ClockIcon from '../icons/ClockIcon';
import { groupMatches } from '../../process/groupMatches';
import MatchSummaryGroupComponent from './MatchSummaryGroup';

interface Props {
    report: MainReport;
}
export default function MatchList({ report }: Props) {
    const userIDs = Object.keys(report.Users);
    const groups = groupMatches(report).reverse();
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
                {groups.map((group) => (
                    <MatchSummaryGroupComponent
                        key={group.Date}
                        report={report}
                        userIDs={userIDs}
                        group={group}
                    />
                ))}
            </tbody>
        </table>
    );
}
