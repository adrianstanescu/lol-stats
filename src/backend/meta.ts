import { MetaChampion } from '../types/common';

import championData from '../assets/champion.json';

export function getMetaChampion(key: string): MetaChampion {
    const c = (championData.data as any)[key];
    return {
        Name: c?.name ?? 'Unknown',
        Title: c?.title ?? 'Unknown champion',
        Sprite: c?.image?.sprite ?? '',
        W: c?.image?.w ?? 0,
        H: c?.image?.h ?? 0,
        X: c?.image?.x ?? 0,
        Y: c?.image?.y ?? 0,
    };
}
