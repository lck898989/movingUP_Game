// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {

    // LIFE-CYCLE CALLBACKS:/

    // onLoad () {}
    private isDown: boolean = false;
    start () {
        let self = this;
        this.node.active = false;
        cc.director.on("ballToBoard",() => {
            // console.log("球碰到了板子");
            if(!self.isDown) {
                self.node.active = true;
                self.node.getComponent(cc.Animation).play("down");
                self.isDown = true;
            }
        },this)
    }
    downOver(): void {
        // 黑洞下落完毕出发
        let rotateAnim: cc.AnimationClip = this.node.getComponent(cc.Animation).getClips()[0];
        if(rotateAnim) {
            let rotateAnimName: string = rotateAnim.name;
            this.node.getComponent(cc.Animation).play(rotateAnimName);
        }
    }
    // update (dt) {}
}
