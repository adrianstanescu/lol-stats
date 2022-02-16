import RadioButtonGroup from '../components/common/RadioButtonGroup';
import MainReportContainer from '../components/Reports/MainReportContainer';
import { AggregateType, useAggregateType } from '../hooks/usePreferences';
import { Suspense } from 'react';

export default function Home() {
    const [aggregateType, setAggregateType] = useAggregateType();

    return (
        <div>
            <RadioButtonGroup
                value={aggregateType}
                onChange={setAggregateType}
                options={Object.values(AggregateType).map((t) => ({
                    value: t,
                    label: t,
                }))}
            />
            <Suspense fallback="Loading...">{<MainReportContainer />}</Suspense>
        </div>
    );
}
