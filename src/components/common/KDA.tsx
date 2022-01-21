import { KDA } from '../../types/common';
import FormattedNumber, { FormattedNumberProps } from './FormattedNumber';
import scoreIcon from '../../assets/score.png';

interface Props extends Omit<FormattedNumberProps, 'value' | 'variant'> {
    value: KDA;
}
export default function KDAComponent({ value, ...rest }: Props) {
    return (
        <span title={((value.Kills + value.Assists) / value.Deaths).toFixed(4)}>
            <img src={scoreIcon} alt="KDA" style={{ width: '1em', height: '1em' }} />{' '}
            <code>
                <FormattedNumber value={value.Kills} {...rest} />
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <FormattedNumber value={value.Deaths} {...rest} />
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <FormattedNumber value={value.Assists} {...rest} />
            </code>
        </span>
    );
}
