import { Match } from '../models/match';
import { APIRequestMethod, riotFetch } from './client';
import cache, { CacheSection } from '../cache';
import { PAGE_SIZE } from '../constants';
import { SummonerAccount } from '../../types/backend';
import { Summoner } from '../models/summoner';

export async function getSummoner(account: SummonerAccount): Promise<Summoner> {
    const key = `${account.server}-${account.name}`;
    const cached = cache.get(CacheSection.APISummoner, key);
    if (cached) {
        return new Summoner(account, cached as Partial<Summoner>);
    }
    const response = await riotFetch(APIRequestMethod.SummonerByName, account.name);
    const data = await response.json();
    cache.set(CacheSection.APISummoner, key, data);
    return new Summoner(account, data as Partial<Summoner>);
}

export async function getMatch(matchID: string): Promise<Match> {
    const cached = await cache.get(CacheSection.APIMatch, matchID);
    if (cached) {
        return new Match(cached as Partial<Match>);
    }
    const response = await riotFetch(APIRequestMethod.Match, matchID);
    const data = await response.json();
    await cache.set(CacheSection.APIMatch, matchID, data);
    return new Match(data as Partial<Match>);
}

export async function getMatchIDs(puuid: string): Promise<string[]> {
    const matchIDs = new Set(
        ((await cache.get(CacheSection.InternalMatchIDs, puuid)) as string[]) ?? []
    );

    let offset = 0;
    let lastPage = false;

    while (true) {
        const response = await riotFetch(APIRequestMethod.MatchIDs, puuid, offset);
        const data = await response.json();
        const matchIDsPage = data as string[];

        for (const matchID of matchIDsPage) {
            if (matchIDs.has(matchID)) {
                lastPage = true;
            }
            matchIDs.add(matchID);
        }
        if (lastPage || matchIDsPage.length < PAGE_SIZE) {
            break;
        }
        offset += PAGE_SIZE;
    }

    const allMatchIDs = Array.from(matchIDs);
    cache.set(CacheSection.InternalMatchIDs, puuid, allMatchIDs);
    return allMatchIDs;
}
