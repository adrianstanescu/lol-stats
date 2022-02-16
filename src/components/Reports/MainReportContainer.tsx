import { useMainReport } from '../../hooks/useReport';
import StatsTable from '../Stats/StatsTable';

export default function MainReportContainer() {
    const report = useMainReport();
    if (!report) {
        return null;
    }
    return (
        <div>
            <StatsTable users={report.Users} />
        </div>
    );
}
