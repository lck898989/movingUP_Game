// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SceneManager from "./SceneManager";
import { LayerState, MusicState, eType } from "./consts/Consts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property([cc.AudioClip])
    public bgm: cc.AudioClip[] = [];
    // 常驻节点
    @property(cc.Node)
    rootNode: cc.Node = null;
    start () {
        cc.game.addPersistRootNode(this.rootNode);
    }
    private playBg(): void {
        if(MusicState.musicState === eType.ON) {
            console.log("music is playing ",cc.audioEngine.isMusicPlaying());
            let randomIndex: number = Math.floor(Math.random() * 3);
            console.log("randomIndex is ",randomIndex);
            if(!cc.audioEngine.isMusicPlaying()) {
                cc.audioEngine.playMusic(this.bgm[randomIndex],true);
            } 
        }
    }
    btnEvent(e: cc.Event,data: any): void {
        this.playBg();
        if(data === "game") {
            cc.director.loadScene("Game");
            
        } else if(data === "setting") {
            // cc.director.loadScene("");
            let sceneManager: SceneManager = <SceneManager>cc.find("Controller").getComponent("SceneManager");
            sceneManager.LS = LayerState.SETTING;
            // cc.find("Controller")
            
        } else if(data === "level") {
            cc.director.loadScene("level");
        }
    }
    // update (dt) {}
}
