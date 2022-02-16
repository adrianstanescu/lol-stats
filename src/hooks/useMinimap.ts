import { RefObject, MouseEvent, useCallback, useRef } from 'react';
import { useScroll } from './useScroll';

interface ElementParams {
    ref?: RefObject<HTMLElement>;
    expandedHeaderHeight?: number;
    collapsedHeaderHeight?: number;
}

export function useMinimap(minimap: ElementParams, content: ElementParams) {
    const dragging = useRef(false);
    const { y } = useScroll(content.ref);
    let contentScrollTop = y ?? 0;
    const headerHeight = Math.max(
        (content.expandedHeaderHeight ?? 0) - (contentScrollTop ?? 0),
        content.collapsedHeaderHeight ?? 0
    );
    const contentElement = content.ref?.current ?? document.documentElement;
    const contentHeight = contentElement.scrollHeight - headerHeight;
    const viewportHeight = contentElement.clientHeight - headerHeight;

    // 0 - 1
    const contentScroll =
        Math.max(
            0,
            contentScrollTop -
                ((content.expandedHeaderHeight ?? 0) - (content.collapsedHeaderHeight ?? 0))
        ) /
        (contentHeight - viewportHeight - headerHeight);

    const viewportRatio = viewportHeight / contentHeight;
    const fullViewportRatio = contentElement.clientHeight / contentHeight;

    const minimapHeaderHeight = Math.max(
        (minimap.expandedHeaderHeight ?? 0) - (minimap.ref?.current?.parentElement?.scrollTop ?? 0),
        minimap.collapsedHeaderHeight ?? 0
    );
    const minimapContentHeight = minimap.ref?.current?.clientHeight ?? 0;
    const minimapContainerHeight = minimap.ref?.current?.parentElement?.clientHeight ?? 0;

    const minimapScrollRange = minimapContentHeight - minimapContainerHeight + minimapHeaderHeight;
    const minimapScrollTop = minimapScrollRange * contentScroll;
    const minimapViewportHeight = minimapScrollRange * viewportRatio;
    const minimapViewportTop =
        (minimapContainerHeight - minimapViewportHeight - minimapHeaderHeight) * contentScroll +
        minimapHeaderHeight;

    if (minimap?.ref?.current?.parentElement) {
        minimap.ref.current.parentElement.scrollTop = minimapScrollTop;
    }

    const handleMove = useCallback(
        (clientY: number) => {
            const ratio = clientY / (minimap.ref?.current?.parentElement?.clientHeight ?? 1);
            const fullMinimapViewportRatio = (minimapScrollRange * fullViewportRatio) / minimapContainerHeight;
            const scaledRatio = ratio / (1 - fullMinimapViewportRatio) - fullMinimapViewportRatio / 2;
            const clampedRatio = Math.max(0, Math.min(1, scaledRatio));
            contentElement.scrollTop =
                (contentElement.scrollHeight - contentElement.clientHeight) * clampedRatio;
        },
        [minimap.ref, minimapScrollRange, minimapContainerHeight, contentElement, fullViewportRatio]
    );

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            if (e.button !== 0) {
                return;
            }
            handleMove(e.clientY);
            dragging.current = true;
        },
        [handleMove]
    );
    const handleMouseUp = useCallback(() => {
        dragging.current = false;
    }, []);
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (dragging.current) {
                handleMove(e.clientY);
            }
        },
        [handleMove]
    );

    return {
        minimapViewportHeight,
        minimapViewportTop,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
    };
}
