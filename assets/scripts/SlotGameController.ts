import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
import { Reel } from './Reel';
import { PAYLINES } from './Paylines';
const { ccclass, property } = _decorator;

@ccclass('SlotGameController')
export class SlotGameController extends Component {
    @property([Reel])
    reels: Reel[] = [];

    @property(Node)
    lineContainer: Node | null = null;

    currentTurboLevel = 1;
    isSpinning = false;

    start() {
        this.reels.forEach(r => {
            r.initReel();
            r.node.on('reelStop', this.onReelStop, this);
        });
    }

    /** Spin button **/
    spin() {
        if (this.isSpinning) {
            this.skipReels();
            return;
        }

        this.isSpinning = true;

        this.reels.forEach((reel, i) => {
            const delay = this.currentTurboLevel === 3 ? 0 : i * 0.1;
            reel.startSpin(this.currentTurboLevel, delay);
        });
    }

    skipReels() {
        this.reels.forEach(r => r.skipSpin());
    }

    onReelStop() {
        if (this.reels.every(r => !r.isSpinning)) {
            this.isSpinning = false;
            this.checkLines();
        }
    }

    /** Check line win **/
    checkLines() {
        PAYLINES.forEach((line, index) => {
            const [r0, row0] = line[0];
            const symbol = this.reels[r0].getSymbolAtRow(row0);

            const match = line.every(([r, row]) =>
                this.reels[r].getSymbolAtRow(row) === symbol
            );

            if (match) this.playLineAnimation(index);
        });
    }

    playLineAnimation(lineIndex: number) {
        if (!this.lineContainer) return;

        const lineNode = this.lineContainer.getChildByName(`Line${lineIndex + 1}`);
        if (!lineNode) return;

        let opacity = lineNode.getComponent(UIOpacity);
        if (!opacity) opacity = lineNode.addComponent(UIOpacity);

        opacity.opacity = 0;

        tween(opacity)
            .repeat(
                3,
                tween().to(0.2, { opacity: 255 }).to(0.2, { opacity: 0 })
            )
            .start();
    }

    /** Cycle Turbo **/
    setTurboLevel() {
        this.currentTurboLevel += 1;
        if (this.currentTurboLevel > 3) this.currentTurboLevel = 1;
        console.log('Turbo level:', this.currentTurboLevel);
    }
}
