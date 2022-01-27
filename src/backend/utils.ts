import { mkdirSync, existsSync, createWriteStream } from 'fs';

import clone from 'just-clone';
import fetch from 'node-fetch';
import { dirname, join } from 'path';
import { extract, Headers } from 'tar-stream';
import { createGunzip } from 'zlib';

import { AwardType, Damage, MatchStats } from '../types/common';

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function aggregateStats(...statsList: MatchStats[]): MatchStats {
    return aggregateObjects(...statsList);
}

export function aggregateAwards(...awardsList: Partial<Record<AwardType, number>>[]): Partial<Record<AwardType, number>> {
    return aggregateObjects(...awardsList);
}

export function aggregateObjects<T extends Record<string, any>>(
    ...list: T[]
): T {
    const total = clone(list[0]);
    for (let i = 1; i < list.length; i++) {
        const item = list[i];
        Object.assign(
            total,
            Object.fromEntries(
                Object.keys(item).map((k) => {
                    if (typeof item[k] === 'number') {
                        if (['Max', 'LargestCriticalStrike'].includes(k)) {
                            return [k, Math.max((total[k] ?? 0), item[k])];
                        }
                        return [k, (total[k] ?? 0) + item[k]];
                    }
                    if (typeof item[k] === 'boolean') {
                        return [k, total[k] || item[k]];
                    }
                    return [k, aggregateObjects(total[k], item[k])];
                })
            )
        );
    }
    return total;
}

export function combinations(...items: string[]): string[][] {
    const [first, ...rest] = items;
    if (rest.length === 0) {
        return [[first]];
    }
    const result = combinations(...rest);
    return result.concat(
        result.map((item) => item.concat(first)),
        [[first]]
    );
}

export function ensureDir(dir: string) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

// https://gist.github.com/max10rogerio/c67c5d2d7a3ce714c4bc0c114a3ddc6e
export const slugify = (...args: (string | number)[]): string => {
    const value = args.join(' ');

    return value
        .normalize('NFD') // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
        .replace(/\s+/g, '-'); // separator
};

export function totalDamage(damage: Damage) {
    return damage.Magic + damage.Physical + damage.True;
}

export async function selectiveExtract(
    url: string,
    destination: string,
    filter: (headers: Headers) => boolean,
    progress?: (done: number, total: number, currentFile: string) => void
): Promise<void> {
    let currentFile = '';
    let done = 0;
    let total = 1;
    const untar = extract();
    untar.on('entry', (header, stream, next) => {
        if (filter(header)) {
            currentFile = header.name;
            if (progress) {
                progress(done, total, currentFile);
            }
            const dest = join(destination, header.name);
            ensureDir(dirname(dest));
            const fh = createWriteStream(dest);
            stream.on('end', () => {
                fh.close();
                currentFile = '';
                next();
            });
            stream.pipe(fh);
        } else {
            stream.on('end', next);
            stream.resume();
        }
        // stream.pipe()
    });
    const gunzip = createGunzip();
    const res = await fetch(url);
    total = Number(res.headers.get('content-length'));
    if (progress) {
        res.body.on('data', (chunk: Buffer | string) => {
            done += chunk.length;
            progress(done, total, currentFile);
        });
    }
    return new Promise((resolve, reject) => {
        untar.on('finish', resolve);
        res.body.pipe(gunzip).pipe(untar);
    });
}

export async function download(
    url: string,
    destination: string
): Promise<void> {
    if (existsSync(destination)) {
        return;
    }
    const res = await fetch(url);
    const fh = createWriteStream(destination);
    ensureDir(dirname(destination));

    return new Promise((resolve, reject) => {
        res.body.on('end', () => {
            fh.close();
            resolve();
        });
        res.body.pipe(fh);
    });
}

export function isDefined<T>(value: T | undefined): value is T {
    return typeof value !== 'undefined';
}
