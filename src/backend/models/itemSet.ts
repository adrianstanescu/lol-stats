import { isDefined } from '../../utils';
import { Item } from './item';

export class ItemSet {
    public items: Item[];
    constructor(items: Array<number | string>) {
        this.items = items.map((id) => Item.get(id)).filter(isDefined);
    }

    isFullBuild() {
        return this.getFinalItems().length === 6;
    }
    getFinalItems() {
        return this.items.filter((item) => item.isFinal());
    }
    getValue() {
        return this.items.reduce((acc, item) => acc + item.getValue(), 0);
    }
    getFullBuildValue() {
        return this.getFinalItems().reduce((acc, item) => acc + item.getValue(), 0);
    }
}
