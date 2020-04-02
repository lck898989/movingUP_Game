import SceneManager from "./SceneManager";
import { LayerState } from "./consts/Consts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    levelBtnsCon: cc.Node = null;
    @property(cc.Prefab)
    levetBtn: cc.Prefab = null;

    private row: number = 4;
    private col: number = 5;
    
    private spaceX: number = 25;
    private spaceY: number = 40;

    private startX: number = 0;
    private startY: number = 0;

    private btnWidth: number = 120;
    private btnHeight: number = 145;

    @property(cc.AudioClip)
    clickAudio: cc.AudioClip = null;

    onLoad () {
        this.startX = - this.levelBtnsCon.width / 2 + this.btnWidth / 2;
        this.startY = this.levelBtnsCon.height / 2 - this.btnHeight / 2;
    }
    private initLevelBtn(): void {
        let levelNum: number = 0;
        for(let i = 0; i < this.row; i++) {
            for(let j = 0; j < this.col; j++) {
                levelNum++;
                let levelItemNode: cc.Node = cc.instantiate(this.levetBtn);
                // if(i >= 1) {
                //     levelItemNode.getComponent(cc.Button).interactable = false;
                // }
                levelItemNode.setPosition(cc.v2(this.startX + j * (this.btnWidth + this.spaceX),this.startY - i * (this.btnHeight + this.spaceY)));
                this.levelBtnsCon.addChild(levelItemNode);
                levelItemNode.name = i.toString();
                levelItemNode.getChildByName("bg").getChildByName("level").getComponent(cc.Label).string = levelNum.toString();
                let btn: cc.Button = <cc.Button>levelItemNode.getComponent(cc.Button);
                btn.node.on("click",this.clickBtn,this);

            }
        }
    }
    private clickBtn(e: cc.Event): void {
        cc.audioEngine.play(this.clickAudio,false,1);
    }
    start () {
        this.initLevelBtn();
    }
    btnEvent(e: cc.Event,data: any): void {
        cc.audioEngine.play(this.clickAudio,false,1);
        if(data === "index") {
            cc.director.loadScene("index");
        } else if(data === "setting") {
            // SceneManager
            // LayerState
            let sceneManager: SceneManager = <SceneManager>cc.find("Controller").getComponent("SceneManager");
            sceneManager.LS = LayerState.SETTING;
            // cc.director.loadScene();
        }
    }

    // update (dt) {}
}
