import { Region, Server } from '../types/riot';
import { Damage, KDA, MatchStats } from '../types/common';

export function baseURL(prefix: Server | Region): string {
    return `https://${prefix}.api.riotgames.com/lol`;
}

export const START_DATE = new Date('2021-01-01 00:00:00');
export const END_DATE = new Date('2021-12-31 23:59:59');

export const PAGE_SIZE = 20;

export const GAME_MODES = {
    CLASSIC: {
        gameMode: 'CLASSIC',
        description: 'Classic Summoner\'s Rift and Twisted Treeline games',
    },
    ODIN: { gameMode: 'ODIN', description: 'Dominion/Crystal Scar games' },
    ARAM: { gameMode: 'ARAM', description: 'ARAM games' },
    TUTORIAL: { gameMode: 'TUTORIAL', description: 'Tutorial games' },
    URF: { gameMode: 'URF', description: 'URF games' },
    DOOMBOTSTEEMO: { gameMode: 'DOOMBOTSTEEMO', description: 'Doom Bot games' },
    ONEFORALL: { gameMode: 'ONEFORALL', description: 'One for All games' },
    ASCENSION: { gameMode: 'ASCENSION', description: 'Ascension games' },
    FIRSTBLOOD: { gameMode: 'FIRSTBLOOD', description: 'Snowdown Showdown games' },
    KINGPORO: { gameMode: 'KINGPORO', description: 'Legend of the Poro King games' },
    SIEGE: { gameMode: 'SIEGE', description: 'Nexus Siege games' },
    ASSASSINATE: { gameMode: 'ASSASSINATE', description: 'Blood Hunt Assassin games' },
    ARSR: { gameMode: 'ARSR', description: 'All Random Summoner\'s Rift games' },
    DARKSTAR: { gameMode: 'DARKSTAR', description: 'Dark Star: Singularity games' },
    STARGUARDIAN: { gameMode: 'STARGUARDIAN', description: 'Star Guardian Invasion games' },
    PROJECT: { gameMode: 'PROJECT', description: 'PROJECT: Hunters games' },
    GAMEMODEX: { gameMode: 'GAMEMODEX', description: 'Nexus Blitz games' },
    ODYSSEY: { gameMode: 'ODYSSEY', description: 'Odyssey: Extraction games' },
    NEXUSBLITZ: { gameMode: 'NEXUSBLITZ', description: 'Nexus Blitz games' },
    ULTBOOK: { gameMode: 'ULTBOOK', description: 'Ultimate Spellbook games' },
};

export const GAME_TYPES = {
    CUSTOM_GAME: {
        gametype: 'CUSTOM_GAME',
        description: 'Custom games',
    },
    TUTORIAL_GAME: {
        gametype: 'TUTORIAL_GAME',
        description: 'Tutorial games',
    },
    MATCHED_GAME: {
        gametype: 'MATCHED_GAME',
        description: 'all other games',
    },
};

export const EMPTY_KDA: KDA = {
    Kills: 0,
    Deaths: 0,
    Assists: 0,
};

export const EMPTY_DAMAGE: Damage = {
    Magic: 0,
    Physical: 0,
    True: 0,
};

export const EMPTY_MATCH_STATS: MatchStats = {
    Roles: {},
    Lanes: {},
    Positions: {},
    Champions: {},
    Classes: {},
    Awards: 0,
    Score: {
        Champion: EMPTY_KDA,
        Inhibitor: EMPTY_KDA,
        Nexus: EMPTY_KDA,
        Turret: EMPTY_KDA,
    },
    KillingSprees: {
        Count: 0,
        Max: 0,
    },
    MultiKills: {
        Double: 0,
        Triple: 0,
        Quadra: 0,
        Penta: 0,
    },
    Spells: {
        Q: 0,
        W: 0,
        E: 0,
        R: 0,
        D: 0,
        F: 0,
    },
    CS: 0,
    Damage: {
        Siege: 0,
        LargestCriticalStrike: 0,
        Champions: EMPTY_DAMAGE,
        Total: EMPTY_DAMAGE,
    },
    Firsts: {
        ChampionKill: false,
        ChampionAssist: false,
        TowerKill: false,
        TowerAssist: false,
    },
    Defense: {
        DamageMitigated: 0,
        DamageTaken: EMPTY_DAMAGE,
        Heal: 0,
    },
    Support: {
        CC: 0,
        Shield: 0,
        Heal: 0,
    },
    Misc: {
        GoldEarned: 0,
        GoldSpent: 0,
        ItemsPurchased: 0,
        LongestTimeSpentLiving: 0,
        TotalTimeSpentDead: 0,
    },
};
