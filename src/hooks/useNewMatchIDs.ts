import { useEffect, useRef, useState } from 'react';
import { useMainReport } from './useReport';

export function useNewMatchIDs() {
    const report = useMainReport();
    const [seenMatchIDs, setSeenMatchIDs] = useState<Set<string>>(new Set());
    const [focused, setFocused] = useState<boolean | undefined>(undefined);
    const initialized = useRef(false);

    const handleFocus = () => {
        setFocused(true);
    };
    const handleBlur = () => {
        setFocused(false);
    };

    useEffect(() => {
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        setFocused(document.hasFocus());
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    useEffect(() => {
        if (!initialized.current) {
            setSeenMatchIDs(new Set(report?.Matches.map((m) => m.ID) ?? []));
        }
        if (focused) {
            if (initialized.current) {
                setTimeout(() => {
                    setSeenMatchIDs(new Set(report?.Matches.map((m) => m.ID) ?? []));
                }, 1000);
            }
        }
        initialized.current = report !== undefined;
    }, [focused, report, setSeenMatchIDs]);

    return new Set(
        report?.Matches.map((m) => m.ID).filter((matchID) => !seenMatchIDs.has(matchID)) ?? []
    );
}
