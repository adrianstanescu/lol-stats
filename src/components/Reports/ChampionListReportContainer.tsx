import { useChampionReport, useMainReport } from '../../hooks/useReport';
import ChampionList from '../Champion/ChampionList';

export default function ChampionListReportContainer() {
    const report = useMainReport();
    const championReport = useChampionReport();
    console.log('CHAMPION REPORT', championReport);
    if (!report) {
        return null;
    }
    return (
        <div>
            <ChampionList report={report} />
        </div>
    );
}
