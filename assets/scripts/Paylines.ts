/** PAYLINES: array of arrays of [reelIndex, rowIndex] */
export const PAYLINES: number[][][] = [
    // Horizontal lines
    [[0, 0], [1, 0], [2, 0]], // top row
    [[0, 1], [1, 1], [2, 1]], // middle row
    [[0, 2], [1, 2], [2, 2]], // bottom row

    // Diagonal lines
    [[0, 0], [1, 1], [2, 2]], // top-left -> bottom-right
    [[0, 2], [1, 1], [2, 0]]  // bottom-left -> top-right
];