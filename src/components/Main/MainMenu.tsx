import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import styles from './MainMenu.module.css';

export default function MainMenu() {
    return (
        <div className={styles.container}>
            <h2>
                <NavLink to="/" className={({isActive}) => clsx(styles.link, {[styles.active]: isActive})}>
                    Stats
                </NavLink>
                <NavLink to="/matches" className={({isActive}) => clsx(styles.link, {[styles.active]: isActive})}>
                    Matches
                </NavLink>
                <NavLink to="/champions" className={({isActive}) => clsx(styles.link, {[styles.active]: isActive})}>
                    Champions
                </NavLink>
            </h2>
        </div>
    );
}
