import MatchListReportContainer from '../components/Reports/MatchListReportContainer';
import { Suspense } from 'react';

export default function Matches() {
    // TODO: split mainReport.json

    return (
        <div>
            <Suspense fallback="Loading...">
                <MatchListReportContainer />
            </Suspense>
        </div>
    );
}
