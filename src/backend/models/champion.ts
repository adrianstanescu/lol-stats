import { readFileSync } from 'fs';
import { join } from 'path';
import { ChampionClassType } from '../../types/common';

interface RiotChampion {
    version: string;
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    info: {
        attack: number;
        defense: number;
        magic: number;
        difficulty: number;
    }
    image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }
    tags: string[];
    partype: string;
    stats: {
        hp: number;
        hpperlevel: number;
        mp: number,
        mpperlevel: number,
        movespeed: number,
        armor: number,
        armorperlevel: number,
        spellblock: number,
        spellblockperlevel: number,
        attackrange: number,
        hpregen: number,
        hpregenperlevel: number,
        mpregen: number,
        mpregenperlevel: number,
        crit: number,
        critperlevel: number,
        attackdamage: number,
        attackdamageperlevel: number,
        attackspeedperlevel: number,
        attackspeed: number,
    }
}

let champions: { [id: string]: RiotChampion } = {};
let championsLoaded = false;
function loadChampions() {
    if (championsLoaded) {
        return;
    }
    const data = JSON.parse(readFileSync(join(__dirname, '..', '..', 'assets', 'champion.json')).toString());
    champions = data.data;
    championsLoaded = true;
}

export class Champion {
    constructor(public id: string, public data: RiotChampion) {}
    static get(id: number | string) {
        loadChampions();
        const sourceData = champions[id.toString()];
        if (sourceData === undefined) {
            return undefined;
        }
        return new Champion(id.toString(), sourceData);
    }

    getClasses(): ChampionClassType[] {
        return this.data.tags.filter(t => t in ChampionClassType) as ChampionClassType[];
    }
}
