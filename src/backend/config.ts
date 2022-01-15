import { config } from 'dotenv';
import { cleanEnv, str } from 'envalid';
import { UserData } from '../types/backend';
import { Region, Server } from '../types/riot';
import { slugify } from './utils';

config();

interface Config {
    REGION: string;
    DATADRAGON_VERSION: string;
    RIOT_API_KEY: string;
    USERS: string;
}

export const env = cleanEnv<Config>(process.env, {
    REGION: str({ choices: ['americas', 'asia', 'europe'] }),
    DATADRAGON_VERSION: str(),
    RIOT_API_KEY: str(),
    USERS: str(),
});

export function configUsers(): UserData[] {
    const userStrings = env.USERS.split(';');

    return userStrings.map((userString) => {
        const [name, accounts] = userString.split(':');
        return {
            id: slugify(name),
            name: name.trim(),
            accounts: accounts.split(',').map((account) => {
                const [summonerName, server] = account.split('@').map(s => s.trim());
                if (!Object.values(Server).includes(server as Server)) {
                    throw new Error('Invalid account server');
                }
                return {
                    name: summonerName,
                    server: server as Server,
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
    return env.DATADRAGON_VERSION;
}