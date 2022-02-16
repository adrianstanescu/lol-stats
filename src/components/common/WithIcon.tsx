import { HTMLProps, ReactNode } from 'react';
import styles from './WithIcon.module.css';

interface Props extends HTMLProps<HTMLSpanElement> {
    url: string;
    children?: ReactNode;
}

export default function WithIcon({url, children, ...rest}: Props) {
    return (
        <span className={styles.wrapper} style={{ backgroundImage: `url(${url})` }} {...rest}>
            {children}
        </span>
    );
}
