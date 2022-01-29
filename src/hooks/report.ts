import { selector, useRecoilValue } from 'recoil';
import { MainReport } from '../types/common';

export enum AggregateType {
    Total = 'Total',
    PerGame = 'PerGame',
    PerMinute = 'PerMinute',
}

interface Preferences {
    aggregateType: AggregateType;
}

export const DEFAULT_PREFERENCES: Preferences = {
    aggregateType: AggregateType.Total,
};

export const mainReportQuery = selector<MainReport | undefined>({
    key: 'mainReportQuery',
    get: async () => {
        const response = await fetch('/mainReport.json');
        return response.json();
    },
});

export const dataDragonVersionQuery = selector<string | undefined>({
    key: 'dataDragonVersionQuery',
    get: ({get}) => {
        const report = get(mainReportQuery);
        return report?.Meta.DataDragonVersion;
    }
});

export function useMainReport() {
    return useRecoilValue(mainReportQuery);
}
export function useDataDragonVersion() {
    return useRecoilValue(dataDragonVersionQuery) ?? 'default';
}