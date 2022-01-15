import { GAME_MODES, GAME_TYPES } from '../backend/constants';

export enum Server {
    BR = 'br1',
    EUNE = 'eun1',
    EUW = 'euw1',
    JP = 'jp1',
    KR = 'kr',
    LAN = 'la1',
    LAS = 'la2',
    NA = 'na1',
    OC = 'oc1',
    TR = 'tr1',
    RU = 'ru',
}

export enum Region {
    AMERICAS = 'americas',
    ASIA = 'asia',
    EUROPE = 'europe',
}

type GameMode = keyof typeof GAME_MODES;
type GameType = keyof typeof GAME_TYPES;

export interface MatchMetadata {
    dataVersion: string;
    matchId: string;
    participants: string[];
}

export interface MatchInfo {
    gameCreation: number;
    gameDuration: number;
    gameMode: GameMode;
    gameStartTimestamp: number;
    gameEndTimestamp: number;
    gameType: GameType;
    gameVersion: string;
    mapId: number;
    participants: MatchParticipant[];
    platformId: Server;
    queueId: number;
    teams: MatchTeam[];
    turnamentCode: string;
}

export interface MatchTeamBan {
    championId: number;
    pickTurn: number;
}

export interface MatchTeam {
    bans: MatchTeamBan[];
    objectives: {
        baron: MatchTeamObjective;
        champion: MatchTeamObjective;
        dragon: MatchTeamObjective;
        inhibitor: MatchTeamObjective;
        riftHerald: MatchTeamObjective;
        tower: MatchTeamObjective;
    };
    teamId: number;
    win: boolean;
}

export interface MatchTeamObjective {
    first: boolean;
    kills: number;
}

export interface MatchParticipant {
    assists: number;
    baronKills: number;
    bountyLevel: number;
    champExperience: number;
    champLevel: number;
    championId: number;
    championName: string;
    championTransform: number;
    consumablesPurchased: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    deaths: number;
    detectorWardsPlaced: number;
    doubleKills: number;
    dragonKills: number;
    firstBloodAssist: boolean;
    firstBloodKill: boolean;
    firstTowerAssist: boolean;
    firstTowerKill: boolean;
    gameEndedInEarlySurrender: boolean;
    gameEndedInSurrender: boolean;
    goldEarned: number;
    goldSpent: number;
    individualPosition: string;
    inhibitorKills: number;
    inhibitorTakedowns: number;
    inhibitorsLost: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    itemsPurchased: number;
    killingSprees: number;
    kills: number;
    lane: string;
    largestCriticalStrike: number;
    largestKillingSpree: number;
    largestMultiKill: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicDamageTaken: number;
    neutralMinionsKilled: number;
    nexusKills: number;
    nexusLost: number;
    nexusTakedowns: number;
    objectivesStolen: number;
    objectivesStolenAssists: number;
    participantId: number;
    pentaKills: number;
    perks: MatchParticipantPerks;
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    profileIcon: number;
    puuid: string;
    quadraKills: number;
    riotIdName: string;
    riotIdTagline: string;
    role: string;
    sightWardsBoughtInGame: number;
    spell1Casts: number;
    spell2Casts: number;
    spell3Casts: number;
    spell4Casts: number;
    summoner1Casts: number;
    summoner1Id: number;
    summoner2Casts: number;
    summoner2Id: number;
    summonerId: string;
    summonerLevel: number;
    summonerName: string;
    teamEarlySurrendered: boolean;
    teamId: number;
    teamPosition: string;
    timeCCingOthers: number;
    timePlayed: number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken: number;
    totalHeal: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    totalTimeSpentDead: number;
    totalUnitsHealed: number;
    tripleKills: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    turretTakedowns: number;
    turretsLost: number;
    unrealKills: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    wardsKilled: number;
    wardsPlaced: number;
    win: boolean;
}

export interface MatchParticipantPerks {
    statPerks: {
        defense: number;
        flex: number;
        offense: number;
    };
    styles: unknown; // TODO
}