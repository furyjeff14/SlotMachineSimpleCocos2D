import { ILineChecker } from './ILineChecker';

export class LineChecker implements ILineChecker {

    check(reels: number[][]): number[] {
        const matchedLines: number[] = [];

        for (let row = 0; row < 3; row++) {
            const symbol = reels[0][row];
            const match = reels.every(r => r[row] === symbol);
            if (match) matchedLines.push(row);
        }

        return matchedLines;
    }
}
