import HADefeatIcon from '../../assets/results/icon-ha-defeat.png';
import HAVictoryIcon from '../../assets/results/icon-ha-victory.png';
import SRDefeatIcon from '../../assets/results/icon-sr-defeat.png';
import SRVictoryIcon from '../../assets/results/icon-sr-victory.png';
import { MatchMap, MatchResult } from '../../types/common';
import styles from './MatchResult.module.css';

interface UIMatchResult {
    title: string;
    icon: string;
}

const RESULTS: Record<MatchResult, Record<MatchMap, UIMatchResult>> = {
    [MatchResult.Win]: {
        [MatchMap.HA]: {
            icon: HAVictoryIcon,
            title: 'WIN - Howling Abyss',
        },
        [MatchMap.SR]: {
            icon: SRVictoryIcon,
            title: "WIN - Summoner's Rift",
        },
    },
    [MatchResult.Loss]: {
        [MatchMap.HA]: {
            icon: HADefeatIcon,
            title: 'LOSS - Howling Abyss',
        },
        [MatchMap.SR]: {
            icon: SRDefeatIcon,
            title: "LOSS - Summoner's Rift",
        },
    },
};

interface Props {
    result: MatchResult;
    map: MatchMap;
    variant?: 'full' | 'default' | 'compact';
}

export default function MatchResultComponent({ result, map, variant = 'default' }: Props) {
    if (variant === 'compact') {
        return (
            <img
                title={RESULTS[result][map].title}
                className={styles.icon}
                src={RESULTS[result][map].icon}
                alt={RESULTS[result][map].title.charAt(0)}
            />
        );
    }
    return (
        <div className={styles.wrapper}>
            <img className={styles.icon} src={RESULTS[result][map].icon} alt={RESULTS[result][map].title.charAt(0)} />
            {variant === 'default' ? <code>{result}</code> : RESULTS[result][map].title}
        </div>
    );
}
