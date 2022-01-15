import { sleep } from '../utils';

import fetch, { RequestInit, Headers } from 'node-fetch';
import { riotAPIKey } from '../config';

export async function riotFetch(url: string, options?: RequestInit) {
    // TODO: poor man's rate limiting
    await sleep(1200);
    console.log('Fetching', url);
    const headers = new Headers(options?.headers);
    headers.append('X-Riot-Token', riotAPIKey());
    return fetch(url, {
        ...(options ?? {}),
        headers,
    });
}
