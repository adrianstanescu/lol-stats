import useFetch, { CachePolicies } from 'use-http';

import { MainReport } from '../types/common';
import MatchList from '../components/Match/MatchList';

export default function Matches() {
    // TODO: split mainReport.json
    const { data } = useFetch<MainReport>(
        '/mainReport.json',
        { cachePolicy: CachePolicies.CACHE_AND_NETWORK },
        []
    );

    return (
        <div>
            {data && <MatchList report={data} />}
        </div>
    );
}
