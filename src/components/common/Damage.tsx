import clsx from 'clsx';

import { Damage, UserReport } from '../../types/common';
import styles from './Damage.module.css';

import trueDamageIcon from '../../assets/true-damage.png';
import physicalDamageIcon from '../../assets/physical-damage.png';
import magicDamageIcon from '../../assets/magic-damage.png';
import { useAggregate } from '../../hooks/usePreferences';
import FormattedNumber from './FormattedNumber';

interface Props {
    variant: 'total' | 'separate';
    damage: Damage;
    user: UserReport;
}

export default function DamageComponent({ variant, damage, user }: Props) {
    const [p, m, t] = useAggregate([damage.Physical, damage.Magic, damage.True], user);
    if (variant === 'total') {
        return <FormattedNumber value={p + m + t} />;
    }
    return (
        <span>
            <code
                className={clsx(styles.damage, styles.physical)}
                style={{
                    backgroundImage: `url(${physicalDamageIcon})`,
                }}
            >
                <FormattedNumber value={p} />
            </code>
            <code
                className={clsx(styles.damage, styles.magic)}
                style={{ backgroundImage: `url(${magicDamageIcon})` }}
            >
                <FormattedNumber value={m} />
            </code>
            <code
                className={clsx(styles.damage, styles.true)}
                style={{ backgroundImage: `url(${trueDamageIcon})` }}
            >
                <FormattedNumber value={t} />
            </code>
        </span>
    );
}
