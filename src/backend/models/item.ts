import { readFileSync } from 'fs';
import { join } from 'path';

interface RiotItem {
    name: string;
    rune: {
        isrune: boolean;
        tier: number;
        type: string;
    };
    gold: {
        base: number;
        total: number;
        sell: number;
        purchasable: boolean;
    };
    group: string;
    description: string;
    plaintext: string;
    consumed: boolean;
    stacks: number;
    depth: number;
    consumeOnFull: boolean;
    from: string[];
    into: string[];
    specialRecipe: number;
    inStore: boolean;
    hideFromAll: boolean;
    requiredChampion: string;
    requiredAlly: string;
    tags: string[];
    maps: { [mapid: string]: boolean };
}

let items: { [itemid: string]: RiotItem } = {};
let itemsLoaded = false;
function loadItems() {
    if (itemsLoaded) {
        return;
    }
    const data = JSON.parse(readFileSync(join(__dirname, '..', '..', 'assets', 'item.json')).toString());
    items = data.data;
    itemsLoaded = true;
}

export class Item {
    constructor(public id: string, public data: RiotItem) {}
    static get(id: number | string) {
        loadItems();
        const sourceData = items[id.toString()];
        if (sourceData === undefined) {
            return undefined;
        }
        return new Item(id.toString(), sourceData);
    }

    getValue() {
        return this.data.gold.total;
    }
    isFinal() {
        if (!this.data) {
            console.log(this.id);
        }
        // TODO: add transformed items e.g. Bulwark of the Mountain
        return (this.data.tags.includes('Boots') && this.data.depth === 2) || this.data.depth === 3;
    }
}
