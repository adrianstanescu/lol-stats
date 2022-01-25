import FormattedNumber, { FormattedNumberProps } from './FormattedNumber';
import goldIcon from '../../assets/gold.png';

export default function Gold(props: Omit<FormattedNumberProps, 'variant'>) {
    return (
        <span>
            <img src={goldIcon} alt="Gold" style={{ width: '1em', height: '1em' }} />{' '}
            <FormattedNumber {...props} />
        </span>
    );
}
