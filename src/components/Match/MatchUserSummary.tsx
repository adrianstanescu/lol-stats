import { MainReport, MatchUserSummary } from '../../types/common';
import Champion from '../common/Champion';
import styles from './MatchUserSummary.module.css';
import KDAComponent from '../common/KDA';
import CS from '../common/CS';
import Gold from '../common/Gold';
import clsx from 'clsx';
import { Fragment } from 'react';

interface Props {
    summary: MatchUserSummary;
    report: MainReport;
    variant?: 'compact' | 'full';
}

export default function MatchUserSummaryComponent({ summary, report, variant = 'compact' }: Props) {
    const metaChampion = report.Meta.Champions[summary.Champion];
    return (
        <div className={clsx(styles.summary, { [styles.compact]: variant === 'compact' })}>
            <Champion value={metaChampion} variant={variant} />
            <div className={styles.details}>
                <div className={styles.kda}>
                    <KDAComponent value={summary.Champions} fractionDigits={0} />
                </div>

                <div className={styles.stats}>
                    {variant === 'full' && (
                        <Fragment>
                            <CS value={summary.CS} fractionDigits={0} />
                            <Gold value={summary.Gold} />
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}
