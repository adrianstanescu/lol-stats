import { Award, AwardSentiment, AwardType } from '../types/common';

export const AWARDS: Award[] = [
    {
        type: AwardType.Kenny,
        name: 'Kenny',
        description: 'Most deaths',
        sentiment: AwardSentiment.Negative,
    },
    {
        type: AwardType.Buddhist,
        name: 'Buddhist',
        description: 'Lowest champion damage',
        sentiment: AwardSentiment.Negative,
    },
    {
        type: AwardType.Bulwark,
        name: 'Bulwark',
        description: 'Most damage taken',
        sentiment: AwardSentiment.Positive,
    },
];
