import { KDA } from '../../types/common';
import FormattedNumber, { FormattedNumberProps } from './FormattedNumber';
import scoreIcon from '../../assets/score.png';
import WithIcon from './WithIcon';

interface Props extends Omit<FormattedNumberProps, 'value' | 'variant'> {
    value: KDA;
    totalGames?: number;
}
export default function KDAComponent({ value, totalGames = 1, ...rest }: Props) {
    return (
        <WithIcon url={scoreIcon} title={((value.Kills + value.Assists) / value.Deaths).toFixed(4)}>
            <code>
                <FormattedNumber value={Math.round(value.Kills / totalGames)} {...rest} />
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <FormattedNumber value={Math.round(value.Deaths / totalGames)} {...rest} />
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <FormattedNumber value={Math.round(value.Assists / totalGames)} {...rest} />
            </code>
        </WithIcon>
    );
}
