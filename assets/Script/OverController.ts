import SceneManager from "./SceneManager";
import { LayerState } from "./consts/Consts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OverController extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {

    }
    btnEvent(e: cc.Event,data: any): void {
        if(data === "restart") {
            // 重新开始游戏
            let animName: string = this.node.getComponent(cc.Animation).getClips[1];
            this.node.getComponent(cc.Animation).play(animName);
            cc.director.loadScene("Game");
        } else if(data === "level") {
            // 回到关卡选择界面
            cc.director.loadScene("level");

        } else if(data === "next") {
            // 下一关游戏
            let sceneManager: SceneManager = <SceneManager>cc.find("Controller").getComponent("SceneManager");
            // 设置遮罩层和loading层显示
            sceneManager.setLayerVisible([LayerState.MASK,LayerState.LOADING]);
            setTimeout(() => {
                sceneManager.LS = LayerState.NONE;
                let curLevel: number = Number(sceneManager.getLevel());
                sceneManager.setLevel(curLevel + 1);
                let animName: string = this.node.getComponent(cc.Animation).getClips[1];
                this.node.getComponent(cc.Animation).play(animName);
                cc.director.loadScene("Game");

            },500);
        }
    }
    update (dt) {

    }
}
