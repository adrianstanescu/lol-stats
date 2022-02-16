import clsx from 'clsx';
import { Fragment, RefObject, useRef } from 'react';
import { useMinimap } from '../../hooks/useMinimap';
import { useMainReport } from '../../hooks/useReport';
import { MatchResult, MatchSummaryGroup } from '../../types/common';
import styles from './MatchListMinimap.module.css';

interface Props {
    groups: MatchSummaryGroup[];
}

interface GroupProps {
    group: MatchSummaryGroup;
    userIDs: string[];
}

function valueStyle(aAmount: number, bAmount: number) {
    if (aAmount > bAmount) {
        return styles.positive;
    }
    if (aAmount < bAmount) {
        return styles.negative;
    }
    return styles.active;
}

function Viewport({ contentRef }: { contentRef: RefObject<HTMLElement> }) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const {
        minimapViewportHeight,
        minimapViewportTop,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
    } = useMinimap(
        {
            ref: contentRef,
            collapsedHeaderHeight: 24,
            expandedHeaderHeight: 24,
        },
        {
            // collapsedHeaderHeight: 0,
            // expandedHeaderHeight: 162,
            collapsedHeaderHeight: 20,
            expandedHeaderHeight: 122,
        }
    );

    return (
        <div
            className={styles.track}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
        >
            <div
                className={styles.viewport}
                style={{ height: minimapViewportHeight, top: minimapViewportTop }}
                ref={viewportRef}
            />
        </div>
    );
}

function MatchListMinimapGroup({ group, userIDs }: GroupProps) {
    return (
        <Fragment key={group.Date}>
            <div className={styles.group}>
                <div className={styles.groupDate} />
                {userIDs.map((userID) => (
                    <div key={userID} className={styles.groupUser}>
                        {group.KDA[userID] !== undefined && group.WinRate[userID] !== undefined && (
                            <Fragment>
                                <div
                                    className={valueStyle(
                                        group.KDA[userID],
                                        group.TotalKDA[userID]
                                    )}
                                />
                                <div
                                    className={valueStyle(
                                        group.WinRate[userID],
                                        group.TotalWinRate[userID]
                                    )}
                                />
                            </Fragment>
                        )}
                    </div>
                ))}
            </div>
            {group.Matches.slice()
                .reverse()
                .map((match) => (
                    <div
                        key={match.ID}
                        className={styles.match}
                    >
                        <div
                            className={clsx(
                                styles.matchResult,
                                match.Result === MatchResult.Win ? styles.positive : styles.negative
                            )}
                        />
                        {userIDs.map((userID) => (
                            <div
                                key={userID}
                                className={clsx(
                                    styles.matchUser,
                                    match.Users[userID] && styles.active
                                )}
                            />
                        ))}
                    </div>
                ))}
        </Fragment>
    );
}

export default function MatchListMinimap({ groups }: Props) {
    const report = useMainReport();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const userIDs = Object.keys(report?.Users ?? []);

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.content} ref={contentRef}>
                <Viewport contentRef={contentRef} />
                <div className={styles.users}>
                    <div />
                    {userIDs.map((userID, index) => (
                        <div
                            key={userID}
                            style={{
                                backgroundColor: `var(--palette-pastel-${index + 1})`,
                            }}
                            title={report?.Users[userID].Name}
                        ></div>
                    ))}
                </div>
                <div className={styles.list}>
                    {groups.map((group, index) => (
                        <MatchListMinimapGroup key={index} group={group} userIDs={userIDs} />
                    ))}
                </div>
            </div>
        </div>
    );
}
