import useFetch from 'use-http';

import { MainReport } from '../types/common';
import RadioButtonGroup from '../components/common/RadioButtonGroup';
import MainReportComponent from '../components/MainReport/MainReport';
import { AggregateType, useAggregateType } from '../hooks/preferences';

export default function Home() {
    const [aggregateType, setAggregateType] = useAggregateType();
    const { data } = useFetch<MainReport>('/mainReport.json', {}, []);

    return (
        <div>
            <h1>Home</h1>
            <RadioButtonGroup
                value={aggregateType}
                onChange={setAggregateType}
                options={Object.values(AggregateType).map((t) => ({
                    value: t,
                    label: t,
                }))}
            />
            {data && <MainReportComponent report={data} />}
        </div>
    );
}
