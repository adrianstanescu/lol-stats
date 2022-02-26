import { getMatch } from '../riot/api';
import { createMainReport } from '../reports';
import { writeFileSync } from 'fs';
import { publicDir } from '../config';
import { join } from 'path';

const INTERVAL = 60_000;

async function startServer() {
    const dir = publicDir();
    const mainReport = await createMainReport();
    mainReport.sortMatches();
    writeFileSync(join(dir, 'mainReport.json'), JSON.stringify(mainReport, null, 2));

    const users = mainReport.getUsers();
    let currentUserIndex = 0;
    setInterval(async () => {
        console.info('checking new matches for user %s', users[currentUserIndex].id, new Date());

        const matchIDs = await users[currentUserIndex].getMatchIDs();
        let updated = false;

        for (const matchID of matchIDs) {
            if (mainReport.matchWasProcessed(matchID)) {
                continue;
            }
            console.log('found new match', matchID);
            updated = true;
            const match = await getMatch(matchID);
            mainReport.addMatch(match);
        }

        if (updated) {
            mainReport.sortMatches();

            writeFileSync(join(dir, 'mainReport.json'), JSON.stringify(mainReport, null, 2));
        }

        currentUserIndex += 1;
        if (currentUserIndex >= users.length) {
            currentUserIndex = 0;
        }
    }, INTERVAL / users.length);
}

startServer();
