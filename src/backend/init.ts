import { loadLatestDataDragonVersion } from './config';
import { loadChampions } from './models/champion';
import { loadSummoners } from './models/summoner';

export async function init() {
    await loadLatestDataDragonVersion();
    await Promise.all([loadChampions(), loadSummoners()]);
}
