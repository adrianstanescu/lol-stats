import { Fragment } from 'react';
import AssasinIcon from '../../assets/classes/assasin.png';
import FighterIcon from '../../assets/classes/fighter.png';
import MageIcon from '../../assets/classes/mage.png';
import MarksmanIcon from '../../assets/classes/marksman.png';
import SupportIcon from '../../assets/classes/support.png';
import TankIcon from '../../assets/classes/tank.png';
import { ChampionClassType } from '../../types/common';
import styles from './ChampionClass.module.css';

interface UIChampionClass {
    icon: string;
}

const CLASSES: Record<ChampionClassType, UIChampionClass> = {
    [ChampionClassType.Assassin]: {
        icon: AssasinIcon,
    },
    [ChampionClassType.Fighter]: {
        icon: FighterIcon,
    },
    [ChampionClassType.Mage]: {
        icon: MageIcon,
    },
    [ChampionClassType.Marksman]: {
        icon: MarksmanIcon,
    },
    [ChampionClassType.Support]: {
        icon: SupportIcon,
    },
    [ChampionClassType.Tank]: {
        icon: TankIcon,
    },
};

interface Props {
    value: ChampionClassType;
    variant?: 'full' | 'compact';
}

export default function ChampionClass({ value, variant = 'full' }: Props) {
    if (variant === 'compact') {
        return (
            <img
                title={value}
                className={styles.icon}
                src={CLASSES[value].icon}
                alt={value.charAt(0)}
            />
        );
    }
    return (
        <Fragment>
            <img className={styles.icon} src={CLASSES[value].icon} alt={value.charAt(0)} />
            {value}
        </Fragment>
    );
}
