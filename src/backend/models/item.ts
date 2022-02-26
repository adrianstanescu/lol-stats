import riotItems from '../../assets/item.json';

type RiotItemID = keyof typeof riotItems.data;

interface RiotItem {
    name: string;
    rune?: {
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
    group?: string;
    description: string;
    plaintext: string;
    consumed?: boolean;
    stacks?: number;
    depth: number;
    consumeOnFull?: boolean;
    from: string[];
    into?: string[];
    specialRecipe?: number;
    inStore?: boolean;
    hideFromAll?: boolean;
    requiredChampion?: string;
    requiredAlly?: string;
    tags: string[];
    maps: { [mapid: string]: boolean };
}

export class Item {
    constructor(public id: string, public data: RiotItem) {}
    static get(id: number | string) {
        const sourceData = riotItems.data[id.toString() as RiotItemID];
        if (sourceData === undefined) {
            return undefined;
        }
        return new Item(id.toString(), sourceData as RiotItem);
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
