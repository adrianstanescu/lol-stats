import { config } from 'dotenv';
import { cleanEnv, str } from 'envalid';
import fetch from 'node-fetch';
import { UserData } from '../types/backend';
import { Region, Server } from '../types/riot';
import { slugify } from './utils';

interface Config {
    REGION: string;
    DATADRAGON_VERSION: string;
    LOCALE: string;
    RIOT_API_KEY: string;
    USERS: string;
    PUBLIC_DIR: string;
}

config();

let latestDataDragonVersion: string = '';

export const env = cleanEnv<Config>(process.env, {
    REGION: str({ choices: ['americas', 'asia', 'europe'] }),
    DATADRAGON_VERSION: str(),
    LOCALE: str(),
    RIOT_API_KEY: str(),
    USERS: str(),
    PUBLIC_DIR: str(),
});


export function configUsers(): UserData[] {
    const userStrings = env.USERS.split(';');

    return userStrings.map((userString) => {
        const [name, accounts] = userString.split(':');
        const userId = slugify(name);
        return {
            id: userId,
            name: name.trim(),
            accounts: accounts.split(',').map((account) => {
                const [summonerName, server] = account.split('@').map((s) => s.trim());
                if (!Object.values(Server).includes(server as Server)) {
                    throw new Error('Invalid account server');
                }
                return {
                    name: summonerName,
                    server: server as Server,
                    userId,
                };
            }),
        };
    });
}

export function configRegion(): Region {
    if (!Object.values(Region).includes(env.REGION as Region)) {
        throw new Error('Invalid region');
    }
    return env.REGION as Region;
}
export function riotAPIKey(): string {
    return env.RIOT_API_KEY;
}

export function datadragonVersion(): string {
    return env.DATADRAGON_VERSION === 'latest' ? latestDataDragonVersion : env.DATADRAGON_VERSION;
}
export function locale(): string {
    return env.LOCALE;
}

export async function loadLatestDataDragonVersion() {
    if (env.DATADRAGON_VERSION !== 'latest') {
        return;
    }
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = (await response.json()) as string[];
    latestDataDragonVersion = versions[0];
    console.log('Data Dragon version:', latestDataDragonVersion);
}

export function publicDir() {
    return env.PUBLIC_DIR;
}
