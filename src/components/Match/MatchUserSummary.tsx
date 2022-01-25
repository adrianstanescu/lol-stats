import { MainReport, MatchUserSummary } from '../../types/common';
import Champion from '../common/Champion';
import styles from './MatchUserSummary.module.css';

import KDAComponent from '../common/KDA';
import CS from '../common/CS';
import Gold from '../common/Gold';

interface Props {
    summary: MatchUserSummary;
    report: MainReport;
}

export default function MatchUserSummaryComponent({ summary, report }: Props) {
    const metaChampion = report.Meta.Champions[summary.Champion];
    return (
        <div className={styles.summary}>
            <div className={styles.champion}>
                <Champion value={metaChampion} />
            </div>
            <div className={styles.details}>
                <div className={styles.kda}>
                    <KDAComponent value={summary.Champions} fractionDigits={0} />
                </div>
                <div className={styles.stats}>
                    <CS value={summary.CS} fractionDigits={0} />
                    <Gold value={summary.Gold} />
                </div>
            </div>
        </div>
    );
}
