import { Server } from './riot';

export interface UserData {
    id: string;
    name: string;
    accounts: SummonerAccount[];
}

export interface SummonerAccount {
    name: string;
    server: Server;
    userId: string;
    // region: Region;
}