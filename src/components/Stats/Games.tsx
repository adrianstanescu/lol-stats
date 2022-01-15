import { UserReport } from '../../types/common';
import { AggregateType, useAggregate, useAggregateType } from '../../hooks/preferences';
import iconDefeat from '../../assets/icon-defeat.webm';
import iconVictory from '../../assets/icon-victory.webm';
import Stat from './Stat';
import styles from './Games.module.css';
import FormattedNumber from '../common/FormattedNumber';
import { Fragment } from 'react';

interface Props {
    user: UserReport;
}

export default function Games({ user }: Props) {
    const total = user.Wins + user.Losses;
    const [aggregateType] = useAggregateType();
    const gamesPlayed = useAggregate(total, user);
    const wins = useAggregate(user.Wins, user);
    const losses = useAggregate(user.Losses, user);
    return (
        <Stat
            primary={
                aggregateType === AggregateType.Total ? (
                    <Fragment>
                        <FormattedNumber value={gamesPlayed} fractionDigits={0} /> games played
                    </Fragment>
                ) : (
                    <Fragment>
                        <FormattedNumber variant="duration" value={user.Duration / total} /> avg
                        game time
                    </Fragment>
                )
            }
            secondary={
                <Fragment>
                    <FormattedNumber variant="percent" value={user.Wins / total} /> win rate
                </Fragment>
            }
            details={
                <div>
                    <div className={styles.icon}>
                        <video autoPlay={true} muted={true} loop={true}>
                            <source src={iconVictory} type="video/webm" />
                        </video>
                    </div>
                    <FormattedNumber value={wins} aggregateType={aggregateType} /> wins,
                    <div className={styles.icon}>
                        <video autoPlay={true} muted={true} loop={true}>
                            <source src={iconDefeat} type="video/webm" />
                        </video>
                    </div>
                    <FormattedNumber value={losses} aggregateType={aggregateType} /> losses
                </div>
            }
        />
    );
}
