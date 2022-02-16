import { KDA } from '../../types/common';
import FormattedNumber, { FormattedNumberProps } from './FormattedNumber';
import scoreIcon from '../../assets/score.png';
import WithIcon from './WithIcon';

interface Props extends Omit<FormattedNumberProps, 'value' | 'variant'> {
    value: KDA;
}
export default function KDAComponent({ value, ...rest }: Props) {
    return (
        <WithIcon url={scoreIcon} title={((value.Kills + value.Assists) / value.Deaths).toFixed(4)}>
            <code>
                <FormattedNumber value={value.Kills} {...rest} />
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <FormattedNumber value={value.Deaths} {...rest} />
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <FormattedNumber value={value.Assists} {...rest} />
            </code>
        </WithIcon>
    );
}
