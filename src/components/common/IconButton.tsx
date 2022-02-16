import clsx from 'clsx';
import { HTMLAttributes, ReactNode } from 'react';

import styles from './IconButton.module.css';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    children?: ReactNode;
}

export default function IconButton({ children, active, ...rest }: Props) {
    return (
        <button className={clsx(styles.button, { [styles.active]: active })} {...rest}>
            {children}
        </button>
    );
}
