import { MainReport } from '../../types/common';
import UserAvatar from '../User/UserAvatar';
import styles from './MatchList.module.css';
import ClockIcon from '../icons/ClockIcon';
import { groupMatches } from '../../process/groupMatches';
import MatchSummaryGroupComponent from './MatchSummaryGroup';
import MatchListMinimap from './MatchListMinimap';
import { usePrimaryUserID } from '../../hooks/usePreferences';
import { useNewMatchIDs } from '../../hooks/useNewMatchIDs';

interface Props {
    report: MainReport;
}
export default function MatchList({ report }: Props) {
    const [primaryUserID] = usePrimaryUserID();
    const newMatchIDs = useNewMatchIDs();
    const userIDs = Object.keys(report.Users).sort((a, _) => (a === primaryUserID ? -1 : 0));
    const groups = groupMatches(report).reverse();
    const minimapMargin = (userIDs.length + 1) * 15 + 6;
    return (
        <div
            className={styles.wrapper}
            style={{ marginRight: `calc(var(--box-unit) * ${minimapMargin} + 2px)` }}
        >
            <div className={styles.matchList}>
                <div className={styles.header}>
                    <div className={styles.timeColumn}>
                        <ClockIcon />
                    </div>
                    <div></div>
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
                    {groups.map((group) => (
                        <MatchSummaryGroupComponent
                            key={group.Date}
                            report={report}
                            userIDs={userIDs}
                            group={group}
                            newMatchIDs={newMatchIDs}
                        />
                    ))}
                </div>
            </div>
            <MatchListMinimap groups={groups} />
        </div>
    );
}
