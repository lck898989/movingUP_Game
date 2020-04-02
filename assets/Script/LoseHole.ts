// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseHole extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private sScale: number = 1;
    start () {
        this.sScale = this.node.scale;
    }
    private loseOver(): void {
        this.node.scale = this.sScale;
    }

    // update (dt) {}
}
