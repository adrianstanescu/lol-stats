import { MatchInfo, MatchMetadata, MatchParticipant, MatchTeam } from '../../types/riot';
import { AwardType, MatchReport, MatchResult, MatchStats, MatchUser } from '../../types/common';
import { aggregateStats } from '../utils';
import { configUsers } from '../config';
import { getMatchAwards } from '../awards';

export class Match {
    metadata!: MatchMetadata;
    info!: MatchInfo;
    status?: {
        message: string;
        status_code: number;
    };
    stats: { [puuid: string]: MatchStats } = {};
    awards: { [puuid: string]: Partial<Record<AwardType, number>> } = {};

    constructor(data: Partial<Match>) {
        Object.assign(this, data);
        if (this.isValid()) {
            this.stats = Object.fromEntries(
                this.info.participants.map((p) => [p.puuid, this.getParticipantStats(p.puuid)])
            );
            this.awards = getMatchAwards(this.stats);
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
        const userPUUIDS = Object.values(this.getUsersPUUID());
        for (const participant of this.info.participants ?? []) {
            if (userPUUIDS.includes(participant.puuid)) {
                const team = this.info.teams.find((t) => t.teamId === participant.teamId);
                if (!team) {
                    throw new Error('Team not found');
                }
                return [
                    team,
                    this.info.participants.filter((p) => p.teamId === participant.teamId),
                ];
            }
        }
        throw new Error('Allied team not found');
    }
    getEnemyTeam(): [MatchTeam, MatchParticipant[]] {
        const [alliedTeam] = this.getAlliedTeam();
        const team = this.info.teams.find((t) => t.teamId !== alliedTeam.teamId);
        if (!team) {
            throw new Error('Enemy team not found');
        }
        return [team, this.info.participants.filter((p) => p.teamId === team.teamId)];
    }

    getParticipantMatch(puuid: string): MatchUser {
        const p = this.info.participants.find((p) => p.puuid === puuid);
        if (!p || !this.stats[puuid]) {
            throw new Error('Participant not found');
        }
        return {
            Champion: p.championName,
            Stats: this.stats[puuid],
            Awards: this.awards[puuid] ?? {},
        };
    }

    getParticipantStats(puuid: string): MatchStats {
        const p = this.info.participants.find((p) => p.puuid === puuid);
        if (!p) {
            throw new Error('Participant not found');
        }
        return {
            AwardCount: 0,
            CS: p.totalMinionsKilled,
            Champions: {
                Kills: p.kills,
                Deaths: p.deaths,
                Assists: p.assists,
            },
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
            Structures: {
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
        // const participantStats = this.info.participants.map((p) =>
        //     this.getParticipantStats(p.puuid)
        // );
        const [alliedTeam, allies] = this.getAlliedTeam();
        const [, enemies] = this.getEnemyTeam();

        return {
            ID: this.metadata.matchId,
            Result: alliedTeam.win ? MatchResult.Win : MatchResult.Loss,
            CreatedAt: this.info.gameCreation,
            Duration: this.durationInSeconds(),
            Allies: aggregateStats(...allies.map((p) => this.stats[p.puuid])),
            Enemies: aggregateStats(...enemies.map((p) => this.stats[p.puuid])),
            Surrendered: false, // TODO!
            Users: Object.fromEntries(
                Object.entries(this.getUsersPUUID()).map(([id, puuid]) => [
                    id,
                    this.getParticipantMatch(puuid),
                ])
            ),
        };
    }
}
