import fetch, { Headers } from 'node-fetch';
import { configRegion, riotAPIKey } from '../config';
import { Server } from '../../types/riot';
import { RateLimiter } from './rateLimiter';
import { baseURL, PAGE_SIZE } from '../constants';

export enum APIRequestMethod {
    SummonerByName = 'SummonerByName',
    MatchIDs = 'MatchIDs',
    Match = 'Match',
}

const METHODS: Record<APIRequestMethod, (...args: any[]) => string> = {
    SummonerByName: (name: string, server: Server = Server.EUNE) =>
        `${baseURL(server)}/summoner/v4/summoners/by-name/${name}`,
    MatchIDs: (puuid: string, start: number = 0, count: number = PAGE_SIZE) =>
        `${baseURL(
            configRegion()
        )}/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`,
    Match: (matchID: string) => `${baseURL(configRegion())}/match/v5/matches/${matchID}`,
};

export class Client {
    private queue = Promise.resolve<any>(undefined);
    private headers: Headers;
    private rateLimiter: RateLimiter;

    constructor(apiKey: string) {
        this.headers = new Headers({
            'X-Riot-Token': apiKey,
        });
        this.rateLimiter = new RateLimiter();
    }

    async fetch(method: APIRequestMethod, ...args: any) {
        const url = METHODS[method](...args);
        const response = this.queue.then(async () => {
            await this.rateLimiter.willRequest(method);
            console.info('fetching', url);
            const response = await fetch(url, { headers: this.headers });
            this.rateLimiter.refreshCounts(method, response.headers);
            // TODO: check errors
            return response;
        });
        this.queue = response.catch(() => {});
        return response;
    }
}

const DEFAULT_CLIENT = new Client(riotAPIKey());

export async function riotFetch(method: APIRequestMethod, ...args: any) {
    return DEFAULT_CLIENT.fetch(method, ...args);
}
