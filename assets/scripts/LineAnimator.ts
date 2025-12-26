import { Node, tween, Vec3 } from 'cc';

export class LineAnimator {
    static animate(nodes: Node[]): void {
        nodes.forEach(node => {
            tween(node)
                .to(0.2, { scale: new Vec3(1.2, 1.2, 1) })
                .to(0.2, { scale: new Vec3(1, 1, 1) })
                .repeat(3)
                .start();
        });
    }
}
