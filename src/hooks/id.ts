import { useRef } from "react";

export function useID(prefix: string = 'id') {
    const ref = useRef(`${prefix}-${(Math.random().toString(36)+'00000000000000000').slice(2, 7)}`);
    return ref.current;
}