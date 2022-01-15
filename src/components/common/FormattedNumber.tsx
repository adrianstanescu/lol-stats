import DurationUnitFormat from 'intl-unofficial-duration-unit-format';
import { AggregateType } from '../../hooks/preferences';
import { FRACTION_DIGITS_BY_AGGREGATE_TYPE } from '../../constants/formatting';

const LOCALE = undefined;

const durationFormatter = new DurationUnitFormat(LOCALE, {
    style: 'narrow',
    format: '{hour} {minutes} {seconds}',
});

interface Props {
    value: number;
    variant?: 'duration' | 'percent' | 'frequency' | 'default';
    prefix?: string;
    suffix?: string;
    fractionDigits?: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    aggregateType?: AggregateType;
}
export default function FormattedNumber({
    value,
    variant = 'default',
    prefix = '',
    suffix = '',
    fractionDigits = 2,
    minimumFractionDigits,
    maximumFractionDigits,
    aggregateType,
}: Props) {
    const minFD = aggregateType
        ? FRACTION_DIGITS_BY_AGGREGATE_TYPE[aggregateType]
        : minimumFractionDigits ?? fractionDigits;
    const maxFD = aggregateType
        ? FRACTION_DIGITS_BY_AGGREGATE_TYPE[aggregateType]
        : maximumFractionDigits ?? fractionDigits;
    if (variant === 'duration') {
        return (
            <span title={`${value} seconds`}>
                {durationFormatter
                    .formatToParts(value)
                    .map((part, i) =>
                        ['literal', 'unit'].includes(part.type) ? (
                            <span key={i}>{part.value}</span>
                        ) : (
                            <code key={i}>{part.value}</code>
                        )
                    )}
            </span>
        );
    } else if (variant === 'percent') {
        const percentFormatter = new Intl.NumberFormat(LOCALE, {
            style: 'percent',
            minimumFractionDigits: minFD,
            maximumFractionDigits: maxFD,
        });
        return <code title={(value * 100).toString()}>{percentFormatter.format(value)}</code>;
    }
    const numberFormatter = new Intl.NumberFormat(LOCALE, {
        notation: 'compact',
        minimumFractionDigits: minFD,
        maximumFractionDigits: maxFD,
    });
    return <code title={value.toString()}>{numberFormatter.format(value)}</code>;
    // const formatter = new Intl.NumberFormat(undefined, {
    //     notation: 'compact',
    //     compactDisplay: 'short',
    //     style,
    //     // unit,
    // });
    // return <Fragment></Fragment>;
}
