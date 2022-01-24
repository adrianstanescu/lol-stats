import { Headers } from 'node-fetch';
import { sleep } from '../utils';
import { APIRequestMethod } from './client';

enum RateLimitType {
    App = 'App',
    Method = 'Method',
}

interface RateLimitConfig {
    type: RateLimitType;
    limit: number;
    seconds: number;
}

interface RateLimitInfo extends RateLimitConfig {
    count: number;
}

const INITIAL_RATE_LIMITS = [
    {
        type: RateLimitType.App,
        seconds: 1,
        limit: 20,
    },
    {
        type: RateLimitType.App,
        seconds: 120,
        limit: 100,
    },
    {
        type: RateLimitType.Method,
        seconds: 10,
        limit: 500,
    },
];

class RateLimit {
    private requests: number[] = [];
    constructor(public limit: number, public seconds: number) {}

    private isLimited() {
        this.refreshCount();
        return this.requests.length >= this.limit - 1;
    }
    async willRequest(): Promise<void> {
        for (let i = 0; i < this.seconds; i++) {
            if (!this.isLimited()) {
                break;
            }
            await sleep(1000);
        }
        this.requests.push(new Date().getTime());
    }
    refreshCount(count?: number) {
        const now = new Date().getTime();
        this.requests = this.requests.filter((date) => {
            return now - date < this.seconds * 1000;
        });
        if (count === undefined) {
            return;
        }

        const diff = count - this.requests.length;
        if (diff > 0) {
            this.requests.push(...Array(diff).fill(now));
        } else if (diff < 0) {
            this.requests.sort();
            this.requests.splice(0, -diff);
        }
    }
}

function parseLimits(value: string): { [seconds: string]: number } {
    return Object.fromEntries(
        value.split(',').map((part) => {
            const [limit, seconds] = part.split(':');
            return [seconds, parseInt(limit, 10)];
        })
    );
}

function getRateLimitStatus(headers?: Headers): RateLimitInfo[] {
    const appRateLimit = parseLimits(headers?.get('X-App-Rate-Limit') ?? '20:1,100:120');
    const appRateLimitCount = parseLimits(headers?.get('X-App-Rate-Limit-Count') ?? '0:1,0:120');
    const methodRateLimit = parseLimits(headers?.get('X-Method-Rate-Limit') ?? '500:10');
    const methodRateLimitCount = parseLimits(headers?.get('X-Method-Rate-Limit-Count') ?? '0:10');

    return [
        ...Object.entries(appRateLimit).map(([seconds, limit]) => ({
            type: RateLimitType.App,
            seconds: parseInt(seconds, 10),
            limit,
            count: appRateLimitCount[seconds],
        })),
        ...Object.entries(methodRateLimit).map(([seconds, limit]) => ({
            type: RateLimitType.Method,
            seconds: parseInt(seconds, 10),
            limit,
            count: methodRateLimitCount[seconds],
        })),
    ];
}

export class RateLimiter {
    private appLimits!: RateLimit[];
    private methodLimits!: Record<APIRequestMethod, RateLimit[]>;
    private hasInitialLimits: boolean = true;
    constructor(limits?: RateLimitConfig[]) {
        this.setLimits(limits ?? INITIAL_RATE_LIMITS);
    }

    private setLimits(limits: RateLimitConfig[]) {
        this.appLimits = limits
            .filter(({ type }) => type === RateLimitType.App)
            .map(({ seconds, limit }) => new RateLimit(limit, seconds));
        const methodLimitConfigs = limits.filter(({ type }) => type === RateLimitType.Method);
        this.methodLimits = Object.fromEntries(
            Object.keys(APIRequestMethod).map((method) => {
                return [
                    method,
                    methodLimitConfigs.map(
                        ({ type, seconds, limit }) => new RateLimit(limit, seconds)
                    ),
                ];
            })
        ) as Record<APIRequestMethod, RateLimit[]>;
    }
    refreshCounts(method: APIRequestMethod, headers: Headers) {
        const status = getRateLimitStatus(headers);
        if (this.hasInitialLimits) {
            this.setLimits(status);
            this.hasInitialLimits = false;
        }
        for (const info of status) {
            const limit =
                info.type === RateLimitType.App
                    ? this.appLimits.find((l) => l.seconds === info.seconds)
                    : this.methodLimits[method]?.find((l) => l.seconds === info.seconds);
            if (!limit) {
                continue;
            }
            limit.refreshCount(info.count);
        }
    }
    async willRequest(method: APIRequestMethod): Promise<void> {
        await Promise.all([
            ...this.appLimits.map((limit) => limit.willRequest()),
            ...this.methodLimits[method].map((limit) => limit.willRequest()),
        ]);
    }
}
