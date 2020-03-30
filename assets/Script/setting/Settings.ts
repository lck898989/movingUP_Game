// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { MusicState, eType, LayerState } from "../consts/Consts";
import SceneManager from "../SceneManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Settings extends cc.Component {

    @property(cc.Node)
    effectCon: cc.Node = null;
    @property(cc.Node)
    musicCon: cc.Node = null;

    onLoad () {

    }

    start () {
        this.effectCon.on(cc.Node.EventType.TOUCH_START,this.tapEffect,this);
        this.musicCon.on(cc.Node.EventType.TOUCH_START,this.tapMusic,this);
        if(MusicState.musicState === eType.ON) {
            this.musicCon.getChildByName("musicOn").active = true;
            this.musicCon.getChildByName("musicOff").active = false;
        } else {
            this.musicCon.getChildByName("musicOn").active = false;
            this.musicCon.getChildByName("musicOff").active = true;
            cc.audioEngine.stopMusic();
        }
        if(MusicState.effectState === eType.ON) {
            this.effectCon.getChildByName("effectOn").active = true;
            this.effectCon.getChildByName("effectOff").active = false;
        } else {
            this.effectCon.getChildByName("effectOn").active = false;
            this.effectCon.getChildByName("effectOff").active = true;
        }
        
    }
    btnEvent(e: cc.Event,data: any): void {
        if(data === "back") {
            this.node.getComponent(cc.Animation).play("settingOut");
        }
    }
    // 
    settingOutOver(): void {
        let sceneManager: SceneManager = <SceneManager>cc.find("Controller").getComponent("SceneManager");
        sceneManager.LS = LayerState.NONE;
    }
    private tapEffect(): void {
        if(MusicState.effectState === eType.ON) {
            this.effectCon.getChildByName("effectOff").active = true;
            this.effectCon.getChildByName("effectOn").active = false;
            MusicState.effectState = eType.OFF;
        } else {
            this.effectCon.getChildByName("effectOff").active = false;
            this.effectCon.getChildByName("effectOn").active = true;
            MusicState.effectState = eType.ON;
        }
        console.log("音效开关状态",MusicState.effectState);
    }
    private tapMusic(): void {
        if(MusicState.musicState === eType.ON) {
            this.musicCon.getChildByName("musicOff").active = true;
            this.musicCon.getChildByName("musicOn").active = false;
            MusicState.musicState = eType.OFF;
            // cc.audioEngine.stopAll();
            cc.audioEngine.pauseMusic();
        } else {
            this.musicCon.getChildByName("musicOff").active = false;
            this.musicCon.getChildByName("musicOn").active = true;
            MusicState.musicState = eType.ON;
            // cc.audioEngine.resumeAll();
            // cc.audioEngine.resumeMusic();
            cc.audioEngine.resumeMusic();
        }
        console.log("背景音乐开关状态",MusicState.musicState);
    }
    onDestroy(): void {
        this.effectCon.off(cc.Node.EventType.TOUCH_START,this.tapEffect,this);
        this.musicCon.off(cc.Node.EventType.TOUCH_START,this.tapMusic,this);
    }
    // update (dt) {}
}
