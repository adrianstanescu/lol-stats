import { RefObject, useEffect, useState } from 'react';

interface Position {
    x?: number;
    y?: number;
}

export function useScroll(ref?: RefObject<HTMLElement>) {
    const [position, setPosition] = useState<Position>({
        x: undefined,
        y: undefined,
    });
    useEffect(() => {
        const element = ref?.current ?? document.documentElement;
        const eventElement = ref?.current ?? document;
        function handleScroll() {
            setPosition({
                x: element.scrollLeft,
                y: element.scrollTop,
            });
        }
        eventElement.addEventListener('scroll', handleScroll, {
            capture: false,
            passive: true,
        });
        handleScroll();
        return () => eventElement.removeEventListener('scroll', handleScroll);
    }, [ref]);
    return position;
}
