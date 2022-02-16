import { useMainReport } from '../../hooks/useReport';
import MatchList from '../Match/MatchList';

export default function MatchListReportContainer() {
    const report = useMainReport();
    if (!report) {
        return null;
    }
    return (
        <div>
            <MatchList report={report} />
        </div>
    );
}
