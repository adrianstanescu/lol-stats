import DurationUnitFormat from 'intl-unofficial-duration-unit-format';
import { AggregateType } from '../../hooks/usePreferences';
import { FRACTION_DIGITS_BY_AGGREGATE_TYPE } from '../../constants/formatting';

const LOCALE = undefined;

const durationFormatter = new DurationUnitFormat(LOCALE, {
    style: 'narrow',
    format: '{hour} {minutes} {seconds}',
});

export interface FormattedNumberProps {
    value: number;
    variant?: 'duration' | 'percent' | 'frequency' | 'default';
    isDiff?: boolean;
    fractionDigits?: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    aggregateType?: AggregateType;
}
export default function FormattedNumber({
    value,
    variant = 'default',
    isDiff = false,
    fractionDigits = 2,
    minimumFractionDigits,
    maximumFractionDigits,
    aggregateType,
}: FormattedNumberProps) {
    const minFD = aggregateType
        ? FRACTION_DIGITS_BY_AGGREGATE_TYPE[aggregateType]
        : minimumFractionDigits ?? fractionDigits;
    const maxFD = aggregateType
        ? FRACTION_DIGITS_BY_AGGREGATE_TYPE[aggregateType]
        : maximumFractionDigits ?? fractionDigits;

    let style = { color: 'inherit' };
    let signDisplay: 'auto' | 'never' | 'always' = 'auto';

    if (isDiff) {
        style.color = value >= 0 ? 'var(--text-color-positive)' : 'var(--text-color-negative)';
        signDisplay = 'always';
    }

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
            style: isDiff ? 'decimal' : 'percent',
            signDisplay,
            minimumFractionDigits: minFD,
            maximumFractionDigits: maxFD,
        });
        return <code style={style} title={(value * 100).toString()}>{percentFormatter.format(isDiff ? value * 100 : value)}</code>;
    }
    const numberFormatter = new Intl.NumberFormat(LOCALE, {
        notation: 'compact',
        signDisplay,
        minimumFractionDigits: minFD,
        maximumFractionDigits: maxFD,
    });
    return <code style={style} title={value.toString()}>{numberFormatter.format(value)}</code>;
    // const formatter = new Intl.NumberFormat(undefined, {
    //     notation: 'compact',
    //     compactDisplay: 'short',
    //     style,
    //     // unit,
    // });
    // return <Fragment></Fragment>;
}
