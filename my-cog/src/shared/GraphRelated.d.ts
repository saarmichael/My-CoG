export interface FreqRange {
    min: number;
    max: number;
}

export interface TimeInterval {
    resolution?: string; // 's' for seconds, 'm' for minutes, 'ms' for milliseconds, 'us' for microseconds
    start: number;
    end: number;
}