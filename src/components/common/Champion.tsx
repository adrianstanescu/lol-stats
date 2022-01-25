import clsx from 'clsx';
import { MetaChampion } from '../../types/common';
import styles from './Champion.module.css';

interface Props {
    value: MetaChampion;
    variant?: 'full' | 'compact';
}

export default function Champion({ value, variant = 'full'}: Props) {
    return (
        <div className={clsx(styles.container, {[styles.compact]: variant === 'compact'})}>
            <div className={styles.iconWrapper} title={`${value.Name}, ${value.Title}`}>
                <div
                    className={styles.icon}
                    style={{
                        width: value.W,
                        height: value.H,
                        backgroundImage: `url(/assets/img/sprite/${value.Sprite}`,
                        backgroundPosition: `${-value.X}px ${-value.Y}px`,
                    }}
                />
            </div>
            <div className={styles.details}>
                <div className={styles.name}><code>{value.Name}</code></div>
                <div className={styles.title}>{value.Title}</div>
            </div>
        </div>
    );
}
