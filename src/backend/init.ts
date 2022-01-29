import { loadLatestDataDragonVersion } from './config';
import { loadChampions } from './models/champion';

export async function init() {
    await loadLatestDataDragonVersion();
    await Promise.all([loadChampions()]);
}
