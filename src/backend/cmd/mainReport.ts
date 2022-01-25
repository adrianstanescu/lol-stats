import { getMatch } from '../riot/api';
import { MainReportBuilder } from '../models/reports';
import { User } from '../models/user';
import { download } from '../utils';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { configUsers, datadragonVersion } from '../config';

async function generateMainReport() {
    const publicDir = join(__dirname, '..', '..', '..', 'public');
    const mainReport = new MainReportBuilder();

    const users = configUsers().map((u) => new User(u));
    for (const user of users) {
        mainReport.addUser(user);
    }

    for (const user of users) {
        const matchIDs = await user.getMatchIDs();
        for (const matchID of matchIDs) {
            const match = await getMatch(matchID);
            if (!match.isValid()) {
                continue;
            }
            const matchReport = match.getReport();
            mainReport.addMatch(matchReport);

        }
        const summoners = await user.getSummoners();
        // console.log(summoners);
        for (const summoner of summoners) {
            const summonerReport = summoner.getReport();
            const iconSrc = `https://ddragon.leagueoflegends.com/cdn/${datadragonVersion()}/${summonerReport.Icon}`;
            const iconDst = join(publicDir, 'assets', summonerReport.Icon);
            
            await download(iconSrc, iconDst);
        }
    }

    const championSprites = Array.from(new Set(Object.values(mainReport.Meta.Champions).map(c => c.Sprite)));
    for (const sprite of championSprites) {
        const src = `https://ddragon.leagueoflegends.com/cdn/${datadragonVersion()}/img/sprite/${sprite}`;
        const dst = join(publicDir, 'assets', 'img', 'sprite', sprite);
        await download(src, dst);
    }

    mainReport.sortMatches();

    writeFileSync(join(publicDir, 'mainReport.json'), JSON.stringify(mainReport));
}
generateMainReport();
