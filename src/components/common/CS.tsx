import FormattedNumber, { FormattedNumberProps } from './FormattedNumber';
import minionIcon from '../../assets/minion.png';

export default function CS(props: Omit<FormattedNumberProps, 'variant'>) {
    return (
        <span>
            <img src={minionIcon} alt="CS" style={{ width: '1em', height: '1em' }} />{' '}
            <FormattedNumber {...props} />
        </span>
    );
}
