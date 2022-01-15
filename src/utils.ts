export const numberFormat = new Intl.NumberFormat(undefined, {
    maximumSignificantDigits: 4,
    minimumSignificantDigits: 4,
});

const NUMBER_SUFFIXES = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

export function formatNumbers(...numbers: number[]): string[] {
    const min = Math.min(...numbers);
    for (let i = 1; i < 9; i++) {
        if (min < 1000 ** i) {
            return numbers.map(
                (n) =>
                    numberFormat.format(n / 1000 ** (i - 1)) +
                    NUMBER_SUFFIXES[i - 1]
            );
        }
    }
    return numbers.map((_) => 'A lot');
}

const DURATION_SUFFIXES = {
    // days: 60 * 60 * 24,
    hours: 60 * 60,
    minutes: 60,
    seconds: 1,
};

export function formatDurations(...durations: number[]): string[] {
    const min = Math.min(...durations);
    for (const [suffix, seconds] of Object.entries(DURATION_SUFFIXES)) {
        if (min >= seconds) {
            return durations.map(
                (d) => numberFormat.format(d / seconds) + ' ' + suffix
            );
        }
    }
    return durations.map(d => d < 1 ? 'No time' : d + ' seconds');
}
