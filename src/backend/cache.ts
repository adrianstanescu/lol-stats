import {
    mkdirSync,
    existsSync,
    statSync,
    readFileSync,
    writeFileSync,
} from 'fs';
import { join } from 'path';

// import { __dirname } from './utils';

export enum CacheSection {
    APISummoner = 'api/summoners',
    APIMatchIDs = 'api/matchids',
    APIMatch = 'api/match',
    InternalMatchIDs = 'internal/matchids',
    // InternalMatch = "internal/match",
}

export class Cache {
    constructor(private dir: string) {
        for (const section of Object.values(CacheSection)) {
            const path = join(dir, section);
            if (!existsSync(path)) {
                mkdirSync(path, { recursive: true });
            }
        }
    }

    get<T>(
        section: CacheSection,
        identifier: string,
        ttl?: number
    ): T | undefined {
        const cacheFile = join(this.dir, section, identifier + '.json');
        if (!existsSync(cacheFile)) {
            return undefined;
        }
        if (ttl) {
            const mtime = statSync(cacheFile).mtime;
            if (!mtime || mtime.getTime() < new Date().getTime() - ttl) {
                return undefined;
            }
        }
        const data = readFileSync(cacheFile).toString();
        return JSON.parse(data);
    }

    set(section: CacheSection, identifier: string, data: unknown): void {
        const text = JSON.stringify(data);
        return writeFileSync(
            join(this.dir, section, identifier + '.json'),
            text
        );
    }
}

const cache = new Cache('.cache');

export default cache;
