export interface IReel {
    spin(): void;
    skip(): void;
    setSpeed(speed: number): void;
    getVisibleSymbols(): number[];
    isSpinning(): boolean;
}