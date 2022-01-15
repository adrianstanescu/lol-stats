import { MainReport } from '../../types/common';
import StatsTable from '../Stats/StatsTable';

interface Props {
    report: MainReport;
}

export default function MainReportComponent({report}: Props) {
    return (
        <div>
            {/* <div className={styles.users}>
                {Object.keys(report.Users).map(id => <User key={id} variant="heading" user={report.Users[id]} /> )}
            </div> */}
            <StatsTable users={report.Users} />
        </div>
    );
}
