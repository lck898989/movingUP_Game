const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }
    btnEvent(e: cc.Event,data: any): void {
        if(data === "level") {
            cc.director.loadScene("level");
        }
    }
    start () {

    }

    update (dt) {

    }
}
