import FormattedNumber, { FormattedNumberProps } from './FormattedNumber';
import minionIcon from '../../assets/minion.png';
import WithIcon from './WithIcon';

export default function CS(props: Omit<FormattedNumberProps, 'variant'>) {
    return (
        <WithIcon url={minionIcon}>
            <FormattedNumber {...props} />
        </WithIcon>
    );
}
