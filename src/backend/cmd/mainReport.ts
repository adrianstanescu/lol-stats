import { join } from 'path';
import { writeFileSync } from 'fs';
import { publicDir } from '../config';
import { createMainReport } from '../reports';

async function generateMainReport() {
    const mainReport = await createMainReport();

    const dir = publicDir();

    writeFileSync(join(dir, 'mainReport.json'), JSON.stringify(mainReport, null, 2));
}
generateMainReport();
