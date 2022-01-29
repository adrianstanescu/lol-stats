import { MetaChampion } from '../types/common';
import { Champion } from './models/champion';

export function getMetaChampion(key: string): MetaChampion {
    const champion = Champion.get(key);
    if (!champion) {
        return {
            Name: key,
            Title: 'Unknown champion',
            Sprite: '',
            W: 48,
            H: 48,
            X: 0,
            Y: 0,
        };
    }
    return {
        Name: champion.data.name,
        Title: champion.data.title,
        Sprite: champion.data.image.sprite,
        W: champion.data.image.w,
        H: champion.data.image.h,
        X: champion.data.image.x,
        Y: champion.data.image.y,
    };
}
