import { ChangeEvent, Fragment, ReactNode } from 'react';
import { useID } from '../../hooks/id';

export interface Option {
    value: string;
    label: ReactNode;
}

interface Props<T> {
    options: Option[];
    value: T;
    onChange: (value: T) => void;
}

export default function RadioButtonGroup<T extends string>({ options, value, onChange }: Props<T>) {
    const id = useID();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value as T);
    };
    return (
        <div>
            {options.map((option, i) => (
                <Fragment key={i}>
                    <input
                        key={option.value}
                        type="radio"
                        value={option.value}
                        id={`${id}-${i}`}
                        onChange={handleChange}
                        checked={value === option.value}
                    />
                    <label htmlFor={`${id}-${i}`}>{option.label}</label>
                </Fragment>
            ))}
        </div>
    );
}
