export enum ChampionClassType {
    Fighter = 'Fighter',
    Tank = 'Tank',
    Mage = 'Mage',
    Assassin = 'Assassin',
    Marksman = 'Marksman',
    Support = 'Support',
}

export interface MetaChampion {
    Name: string;
    Title: string;
    Sprite: string;
    X: number;
    Y: number;
    W: number;
    H: number;
}

export interface MainReport {
    Users: {
        [id: string]: UserReport;
    };
    Matches: MatchSummary[];

    Venn: { key: string[]; data: number }[];
    Meta: {
        Champions: { [key: string]: MetaChampion };
    };
}

export enum MatchResult {
    Win = 'Win',
    Loss = 'Loss',
}

export enum MatchMap {
    SR = 'SR',
    HA = 'HA',
}

export interface MatchReport {
    ID: string;
    Map: MatchMap;
    Result: MatchResult;
    CreatedAt: number;
    Duration: number; // in seconds
    Surrendered: boolean; // gameEndedInSurrender
    Enemies: MatchStats;
    Allies: MatchStats;
    Users: {
        [id: string]: MatchUser;
    };
}

export enum MatchUserType {
    Ally = 'Ally',
    Enemy = 'Enemy',
}

export interface MatchUser {
    Type: MatchUserType;
    Position: string;
    Role: string;
    Lane: string;
    Stats: MatchStats;
    Items: number[];
    Champion: string;
    Awards: Partial<Record<AwardType, number>>;
}

// export interface MatchAward {
//     Type: AwardType;
//     Name: string;
//     Description: string;
//     Sentiment: AwardSentiment;
//     Count: number;
// }

export interface UserReport {
    Name: string;
    Stats: MatchStats;
    Wins: number;
    Losses: number;
    Duration: number; // in seconds
    Summoners: SummonerReport[];
    Awards: Partial<Record<AwardType, number>>;
}

export interface SummonerReport {
    Name: string;
    Icon: string;
    Level: number;
}

export interface MatchUserSummary {
    Champion: string;
    Champions: KDA;
    CS: number;
    Gold: number;
}

export interface MatchSummary {
    ID: string;
    Map: MatchMap;
    Result: MatchResult;
    CreatedAt: number;
    Duration: number;
    Users: {
        [id: string]: MatchUserSummary;
    };
}

export interface KDA {
    Kills: number;
    Deaths: number;
    Assists: number;
}

export interface Damage {
    Magic: number;
    Physical: number;
    True: number;
}

export interface MatchStats {
    Positions: Record<string, number>;
    Roles: Record<string, number>;
    Lanes: Record<string, number>;
    Awards: number;
    Champions: Record<string, number>;
    Classes: Partial<Record<ChampionClassType, number>>;
    Score: {
        Champion: KDA;
        Inhibitor: KDA;
        Nexus: KDA;
        Turret: KDA;
    };

    KillingSprees: {
        Count: number;
        Max: number; // largestKillingSpree
    };
    // OFFENSE
    MultiKills: {
        Double: number; // doubleKills
        Triple: number;
        Quadra: number;
        Penta: number;
    };

    Spells: {
        Q: number;
        W: number;
        E: number;
        R: number;
        D: number;
        F: number;
    };
    CS: number; // totalMinionsKilled

    Damage: {
        // siege master?
        Siege: number; // damageDealtToBuildings
        LargestCriticalStrike: number;
        Champions: Damage;
        Total: Damage;
    };
    Firsts: {
        ChampionKill: boolean;
        ChampionAssist: boolean;
        TowerKill: boolean;
        TowerAssist: boolean;
    };
    // DEFENSE
    Defense: {
        DamageMitigated: number; // damageSelfMitigated
        DamageTaken: Damage;
        Heal: number; // totalHeal - totalHealsOnTeammates
    };

    // SUPPORT
    Support: {
        CC: number; // totalTimeCCDealt
        Shield: number;
        Heal: number; // totalHealsOnTeammates
    };

    // MISC
    Misc: {
        GoldEarned: number;
        GoldSpent: number;
        ItemsPurchased: number;
        LongestTimeSpentLiving: number;
        TotalTimeSpentDead: number;
    };
}

export enum AwardType {
    Kenny = 'Kenny',
    Buddhist = 'Buddhist',
    TreeHugger = 'TreeHugger',
    ThriftShopper = 'ThriftShopper',
    UnderpantsGnome = 'UnderpantsGnome',
    Trailblazer = 'Trailblazer',
    BavarianGod = 'BavarianGod',
    ScaredyPants = 'ScaredyPants',
    Bulwark = 'Bulwark',
    Thicc = 'Thicc',
    CombatMedic = 'CombatMedic',
    Dominator = 'Dominator',
    Protector = 'Protector',
    Finisher = 'Finisher',
    PainBringer = 'PainBringer',
    SiegeMaster = 'SiegeMaster',
    CreepLover = 'CreepLover',
    CrowdController = 'CrowdController',
    SoleSurvivor = 'SoleSurvivor',
    RichBitch = 'RichBitch',
    AlQaeda = 'AlQaeda',
    PressingIntensifies = 'PressingIntensifies',
}

export enum AwardSentiment {
    Neutral = 'Neutral',
    Positive = 'Positive',
    Negative = 'Negative',
}

export interface Award {
    type: AwardType;
    name: string;
    description: string;
    sentiment: AwardSentiment;
}

export interface MatchSummaryGroup {
    Date: string;
    TotalKDA: {
        [id: string]: number;
    };
    KDA: {
        [id: string]: number;
    };
    TotalWinRate: {
        [id: string]: number;
    };
    WinRate: {
        [id: string]: number;
    };
    PreviousGroup?: MatchSummaryGroup;
    Matches: MatchSummary[];
}