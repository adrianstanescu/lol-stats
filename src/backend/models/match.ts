import { MatchInfo, MatchMetadata, MatchParticipant, MatchTeam } from '../../types/riot';
import {
    AwardType,
    ChampionClassType,
    MatchMap,
    MatchReport,
    MatchResult,
    MatchStats,
    MatchUser,
    MatchUserType,
} from '../../types/common';
import { aggregateStats } from '../utils';
import { configUsers } from '../config';
import { getMatchAwards } from '../awards';
import { Champion } from './champion';

export class Match {
    metadata!: MatchMetadata;
    info!: MatchInfo;
    status?: {
        message: string;
        status_code: number;
    };
    alliedTeamID: number = 0;
    stats: { [puuid: string]: MatchStats } = {};
    users: { [puuid: string]: MatchUser } = {};
    awards: { [puuid: string]: Partial<Record<AwardType, number>> } = {};

    constructor(data: Partial<Match>) {
        Object.assign(this, data);
        if (this.isValid()) {
            const userPUUIDS = Object.values(this.getUsersPUUID());
            for (const participant of this.info.participants ?? []) {
                if (userPUUIDS.includes(participant.puuid)) {
                    this.alliedTeamID = participant.teamId;
                }
            }

            this.stats = Object.fromEntries(
                this.info.participants.map((p) => [p.puuid, this.getParticipantStats(p)])
            );
            this.users = Object.fromEntries(
                this.info.participants.map((p) => [p.puuid, this.getParticipantMatch(p)])
            );
            this.awards = getMatchAwards(this.users);
            for (const puuid of Object.keys(this.users)) {
                this.users[puuid].Awards = this.awards[puuid] ?? {};
            }
        }
    }

    isValid() {
        return this.status?.status_code !== 404;
    }

    getUsersPUUID() {
        const puuids: { [id: string]: string } = {};

        for (const user of configUsers()) {
            for (const account of user.accounts) {
                for (const participant of this.info.participants) {
                    if (participant.summonerName.toLowerCase() === account.name.toLowerCase()) {
                        puuids[user.id] = participant.puuid;
                    }
                }
            }
        }
        return puuids;
    }

    getAlliedTeam(): [MatchTeam, MatchParticipant[]] {
        const team = this.info.teams.find((t) => t.teamId === this.alliedTeamID);
        if (!team) {
            throw new Error('Team not found');
        }
        return [team, this.info.participants.filter((p) => p.teamId === this.alliedTeamID)];
    }
    getEnemyTeam(): [MatchTeam, MatchParticipant[]] {
        const [alliedTeam] = this.getAlliedTeam();
        const team = this.info.teams.find((t) => t.teamId !== alliedTeam.teamId);
        if (!team) {
            throw new Error('Enemy team not found');
        }
        return [team, this.info.participants.filter((p) => p.teamId === team.teamId)];
    }

    getParticipantMatch(p: MatchParticipant): MatchUser {
        if (!this.stats[p.puuid]) {
            throw new Error('Participant not found');
        }
        return {
            Type: p.teamId === this.alliedTeamID ? MatchUserType.Ally : MatchUserType.Enemy,
            Position: p.individualPosition,
            Lane: p.lane,
            Role: p.role,
            Champion: p.championName,
            Items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
            Stats: this.stats[p.puuid],
            Awards: {},
        };
    }

    getParticipantStats(p: MatchParticipant): MatchStats {
        return {
            Positions: {
                [p.individualPosition]: 1,
            },
            Lanes: {
                [p.lane]: 1,
            },
            Roles: {
                [p.role]: 1,
            },
            Champions: {
                [p.championName]: 1,
            },
            Classes: Object.fromEntries(
                Champion.get(p.championName)
                    ?.getClasses()
                    ?.map((c) => [c, 1]) ?? []
            ) as Partial<Record<ChampionClassType, number>>,
            Awards: 0,
            CS: p.totalMinionsKilled,
            Damage: {
                Champions: {
                    Magic: p.magicDamageDealtToChampions,
                    Physical: p.physicalDamageDealtToChampions,
                    True: p.trueDamageDealtToChampions,
                },
                LargestCriticalStrike: p.largestCriticalStrike,
                Siege: p.damageDealtToObjectives,
                Total: {
                    Magic: p.magicDamageDealt,
                    Physical: p.physicalDamageDealt,
                    True: p.trueDamageDealt,
                },
            },
            Defense: {
                DamageMitigated: p.damageSelfMitigated,
                DamageTaken: {
                    Magic: p.magicDamageTaken,
                    Physical: p.physicalDamageTaken,
                    True: p.trueDamageTaken,
                },
                Heal: p.totalHeal - p.totalHealsOnTeammates,
            },
            Firsts: {
                ChampionAssist: p.firstBloodAssist,
                ChampionKill: p.firstBloodKill,
                TowerAssist: p.firstTowerAssist,
                TowerKill: p.firstTowerKill,
            },
            KillingSprees: {
                Count: p.killingSprees,
                Max: p.largestKillingSpree,
            },
            Misc: {
                GoldEarned: p.goldEarned,
                GoldSpent: p.goldSpent,
                ItemsPurchased: p.itemsPurchased,
                LongestTimeSpentLiving: p.longestTimeSpentLiving,
                TotalTimeSpentDead: p.totalTimeSpentDead,
            },
            MultiKills: {
                Double: p.doubleKills,
                Triple: p.tripleKills,
                Quadra: p.quadraKills,
                Penta: p.pentaKills,
            },
            Spells: {
                Q: p.spell1Casts,
                W: p.spell2Casts,
                E: p.spell3Casts,
                R: p.spell4Casts,
                D: p.summoner1Casts,
                F: p.summoner2Casts,
            },
            Score: {
                Champion: {
                    Kills: p.kills,
                    Deaths: p.deaths,
                    Assists: p.assists,
                },
                Inhibitor: {
                    Kills: p.inhibitorKills,
                    Deaths: p.inhibitorsLost ?? 0,
                    Assists: p.inhibitorTakedowns ?? 0,
                },
                Nexus: {
                    Kills: p.nexusKills,
                    Deaths: p.nexusLost ?? 0,
                    Assists: p.nexusTakedowns ?? 0,
                },
                Turret: {
                    Kills: p.turretKills,
                    Deaths: p.turretsLost ?? 0,
                    Assists: p.turretTakedowns ?? 0,
                },
            },
            Support: {
                CC: p.totalTimeCCDealt,
                Heal: p.totalHealsOnTeammates,
                Shield: p.totalDamageShieldedOnTeammates,
            },
        };
    }

    durationInSeconds(): number {
        if (this.info.gameEndTimestamp) {
            return this.info.gameDuration;
        }
        return this.info.gameDuration / 1000;
    }

    getReport(): MatchReport {
        const [alliedTeam, allies] = this.getAlliedTeam();
        const [, enemies] = this.getEnemyTeam();

        return {
            ID: this.metadata.matchId,
            Map: ['ARAM', 'KINGPORO'].includes(this.info.gameMode) ? MatchMap.HA : MatchMap.SR,
            Result: alliedTeam.win ? MatchResult.Win : MatchResult.Loss,
            CreatedAt: this.info.gameCreation,
            Duration: this.durationInSeconds(),
            Allies: aggregateStats(...allies.map((p) => this.stats[p.puuid])),
            Enemies: aggregateStats(...enemies.map((p) => this.stats[p.puuid])),
            Surrendered: false, // TODO!
            Users: Object.fromEntries(
                Object.entries(this.getUsersPUUID()).map(([id, puuid]) => [id, this.users[puuid]])
            ),
        };
    }
}
