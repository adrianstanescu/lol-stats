import FormattedNumber, { FormattedNumberProps } from './FormattedNumber';
import goldIcon from '../../assets/gold.png';
import WithIcon from './WithIcon';

export default function Gold(props: Omit<FormattedNumberProps, 'variant'>) {
    return (
        <WithIcon url={goldIcon}>
            <FormattedNumber {...props} />
        </WithIcon>
    );
}
