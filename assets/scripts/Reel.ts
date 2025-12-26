import { _decorator, Component, Sprite, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Reel')
export class Reel extends Component {

    @property([Sprite])
    tiles: Sprite[] = [];

    @property([SpriteFrame])
    symbolFrames: SpriteFrame[] = [];

    isSpinning = false;

    private spinSpeed = 0;           // pixels/sec
    private spinDuration = 2;        // seconds
    private elapsed = 0;

    private readonly tileHeight = 100;
    private readonly visibleRowCount = 3;

    private resultSymbols: number[] = [];

    /** Start Spin **/
    startSpin(turboLevel: number, delay = 0) {
        // Generate result upfront
        this.resultSymbols = this.generateResult();

        // Turbo 3 → instantly finish
        if (turboLevel === 3) {
            this.isSpinning = true;
            setTimeout(() => this.finishSpin(), delay * 1000);
            return;
        }

        // Normal / Fast spins
        this.isSpinning = true;
        this.elapsed = 0;
        const tilesPerSecond = turboLevel === 2 ? 30 : 15;
        this.spinDuration = turboLevel === 2 ? 1 : 2;
        this.spinSpeed = tilesPerSecond * this.tileHeight;

        setTimeout(() => {
            this.schedule(this.updateSpin, 0);
        }, delay * 1000);
    }

    /** Skip Spin **/
    skipSpin() {
        if (!this.isSpinning) return;
        this.finishSpin();
    }

    /** Spin Movement **/
    private updateSpin(dt: number) {
        if (!this.isSpinning) return;

        this.elapsed += dt;
        const move = this.spinSpeed * dt;

        for (const tile of this.tiles) {
            let y = tile.node.position.y - move;

            // recycle without changing symbol
            if (y < -this.tileHeight * this.tiles.length) {
                y += this.tileHeight * this.tiles.length;
            }

            tile.node.setPosition(0, y, 0);
        }

        if (this.elapsed >= this.spinDuration) {
            this.finishSpin();
        }
    }

    initReel() {
        for (let i = 0; i < this.tiles.length; i++) {
            const r = Math.floor(Math.random() * this.symbolFrames.length);
            this.tiles[i].spriteFrame = this.symbolFrames[r];
            this.tiles[i].node.setPosition(0, -i * this.tileHeight, 0);
        }

        // Cache top visible symbols
        this.cacheVisibleSymbols();
    }

    /** Stop Spin **/
    private finishSpin() {
        this.unschedule(this.updateSpin);
        this.isSpinning = false;

        // Apply top visible symbols
        for (let row = 0; row < this.visibleRowCount; row++) {
            this.tiles[row].spriteFrame = this.symbolFrames[this.resultSymbols[row]];
            this.tiles[row].node.setPosition(0, -row * this.tileHeight, 0);
        }

        // Snap remaining tiles
        for (let i = this.visibleRowCount; i < this.tiles.length; i++) {
            this.tiles[i].node.setPosition(0, -i * this.tileHeight, 0);
        }

        this.node.emit('reelStop');
    }

    private cacheVisibleSymbols() {
        this.resultSymbols = this.tiles
            .slice(0, this.visibleRowCount)
            .map(t => this.symbolFrames.indexOf(t.spriteFrame));
    }

    private generateResult(): number[] {
        const result: number[] = [];
        for (let i = 0; i < this.visibleRowCount; i++) {
            result.push(Math.floor(Math.random() * this.symbolFrames.length));
        }
        return result;
    }

    getSymbolAtRow(row: number): number {
        return this.resultSymbols[row];
    }
}
