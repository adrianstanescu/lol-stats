// deprecated, using CDN

import bytes from 'bytes';
import { join } from 'path';
import { Headers } from 'tar-stream';
import { datadragonVersion } from '../config';
import { selectiveExtract } from '../utils';

function filterDataDragon(headers: Headers) {
    if (headers.name.match(/img\/profileicon\/\d+\.png/)) {
        return true;
    }
    return false;
}

let prevPercent = '';
let prevFile = '';

function downloadProgress(done: number, total: number, currentFile: string) {
    const percent = Math.round((done / total) * 100) + '%';
    if (percent !== prevPercent || currentFile !== prevFile) {
        console.log(`${bytes(done)} / ${bytes(total)}`, percent, currentFile);
    }
    prevPercent = percent;
    prevFile = currentFile;
}

async function downloadAssets(version: string) {
    console.log('Downloading datadragon assets');
    const url = `https://ddragon.leagueoflegends.com/cdn/dragontail-${version}.tgz`;
    await selectiveExtract(
        url,
        join(__dirname, '..', 'assets'),
        filterDataDragon,
        downloadProgress
    );
    console.log('done');
}

downloadAssets(datadragonVersion());
