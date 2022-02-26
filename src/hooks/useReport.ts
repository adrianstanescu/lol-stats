import { atom, selector, useRecoilValue } from 'recoil';
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

const mainReportState = atom<MainReport | undefined>({
    key: 'mainReportState',
    default: undefined,
    effects_UNSTABLE: [
        ({ setSelf, trigger }) => {
            let monitor: number;
            if (trigger === 'get') {
                let hash = '';
                fetch('/mainReport.json')
                    .then((r) => r.json())
                    .then((data) => {
                        hash = data.Hash;
                        setSelf(data);
                    });
                setInterval(() => {
                    fetch('/mainReport.json')
                        .then((r) => r.json())
                        .then((data) => {
                            if (hash !== data.Hash) {
                                hash = data.Hash;
                                setSelf(data);
                            }
                        });
                }, 10_000);
            }
            return () => {
                if (monitor) {
                    clearInterval(monitor);
                }
            };
        },
    ],
});

export const dataDragonVersionQuery = selector<string | undefined>({
    key: 'dataDragonVersionQuery',
    get: ({ get }) => {
        const report = get(mainReportState);
        return report?.Meta.DataDragonVersion;
    },
});

export function useMainReport() {
    return useRecoilValue(mainReportState);
}
export function useDataDragonVersion() {
    return useRecoilValue(dataDragonVersionQuery) ?? 'default';
}
