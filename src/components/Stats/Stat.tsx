import { ReactNode } from 'react';

import styles from './Stat.module.css';

interface Props {
    primary: ReactNode;
    secondary?: ReactNode;
    details?: ReactNode;
}

export default function Stat({ primary, secondary, details }: Props) {
    return (
        <div>
            <div className={styles.primary}>{primary}</div>
            <div className={styles.secondary}>{secondary}</div>
            <div className={styles.details}>{details}</div>
        </div>
    );
}
