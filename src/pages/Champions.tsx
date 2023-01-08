import ChampionListReportContainer from '../components/Reports/ChampionListReportContainer';
import { Suspense } from 'react';

export default function Champions() {
    // TODO: split mainReport.json

    return (
        <div>
            <Suspense fallback="Loading...">
                <ChampionListReportContainer />
            </Suspense>
        </div>
    );
}
