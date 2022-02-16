import clsx from 'clsx';
import { MetaChampion } from '../../types/common';
import styles from './Champion.module.css';
import championMissingIcon from '../../assets/championmissing.png';
import { useDataDragonVersion } from '../../hooks/useReport';

interface Props {
    value: MetaChampion;
    variant?: 'full' | 'compact';
}

export default function Champion({ value, variant = 'full'}: Props) {
    const dataDragonVersion = useDataDragonVersion();
    return (
        <div className={clsx(styles.container, {[styles.compact]: variant === 'compact'})}>
            <div className={styles.iconWrapper} title={`${value.Name}, ${value.Title}`}>
                <div
                    className={styles.icon}
                    style={{
                        width: value.W,
                        height: value.H,
                        backgroundImage: value.Sprite ? `url(/dd/${dataDragonVersion}/img/sprite/${value.Sprite}` : `url(${championMissingIcon})`,
                        backgroundPosition: `${-value.X}px ${-value.Y}px`,
                    }}
                />
            </div>
            <div className={styles.details}>
                <div className={styles.name}><code>{value.Name}</code></div>
                <div className={styles.title} title={value.Title}>{value.Title}</div>
            </div>
        </div>
    );
}
