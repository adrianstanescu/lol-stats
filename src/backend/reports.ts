import { init } from './init';
import { getMatch } from './riot/api';
import { MainReportBuilder } from './models/reports';
import { User } from './models/user';
import { download } from './utils';
import { join } from 'path';
import { configUsers, datadragonVersion, publicDir } from './config';

export async function createMainReport(): Promise<MainReportBuilder> {
    await init();

    const dir = publicDir();
    const mainReport = new MainReportBuilder();

    const users = configUsers().map((u) => new User(u));
    for (const user of users) {
        mainReport.addUser(user);
    }

    for (const user of users) {
        const matchIDs = await user.getMatchIDs();
        for (const matchID of matchIDs) {
            const match = await getMatch(matchID);
            mainReport.addMatch(match);
        }
        const summoners = await user.getSummoners();
        // console.log(summoners);
        for (const summoner of summoners) {
            const summonerReport = summoner.getReport();
            const iconSrc = `https://ddragon.leagueoflegends.com/cdn/${datadragonVersion()}/img/profileicon/${
                summonerReport.Icon
            }`;
            const iconDst = join(
                dir,
                'dd',
                datadragonVersion(),
                'img',
                'profileicon',
                summonerReport.Icon
            );

            await download(iconSrc, iconDst);
        }
    }

    const championSprites = Array.from(
        new Set(Object.values(mainReport.Meta.Champions).map((c) => c.Sprite))
    );
    for (const sprite of championSprites) {
        if (!sprite) {
            continue;
        }
        const src = `https://ddragon.leagueoflegends.com/cdn/${datadragonVersion()}/img/sprite/${sprite}`;
        const dst = join(dir, 'dd', datadragonVersion(), 'img', 'sprite', sprite);
        await download(src, dst);
    }

    mainReport.sortMatches();

    return mainReport;
}
