const {ccclass, property} = cc._decorator;
import {LayerState} from "./consts/Consts";
// enum LayerState {
    
// };
@ccclass
export default class SceneManager extends cc.Component{
    // LIFE-CYCLE CALLBACKS:
    private static _instance: SceneManager = null;
    private level: number = 2;
    private _root: cc.Node = null;
    public static getInstance(): SceneManager {
        if(!this._instance) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }
    
    // 设置层
    @property(cc.Node)
    settingNode: cc.Node = null;
    // 特效层
    @property(cc.Node)
    effecLayer: cc.Node = null;
    // 数据加载中层
    @property(cc.Node)
    loadingLayer: cc.Node = null;
    // 遮罩层
    @property(cc.Node)
    maskLayer: cc.Node = null;

    private layerState: LayerState = LayerState.NONE;
    


    start(): void {
        cc.director.on("levelChoose",this.chooseLevel,this);
        this.LS = LayerState.NONE;
    }
    set LS(state: LayerState) {
        this.layerState = state;
        switch(state) {
            case LayerState.NONE:
                this.node.active = false;
                // this.setLayerVisible([]);
                break;
            case LayerState.EFFECT:
                this.setLayerVisible([state]);
                break;
            case LayerState.SETTING:
                console.log("开始显示设置界面");
                this.setLayerVisible([state]);
                let inAnim: string = this.settingNode.getComponent(cc.Animation).getClips()[0].name;
                this.settingNode.getComponent(cc.Animation).play(inAnim);
                break;
            case LayerState.MASK:
                this.setLayerVisible([state]);
                break;
            case LayerState.LOADING:
                this.setLayerVisible([state]);
                break;               

        }
    }
    public setLayerVisible(index: number[]): void {
        this.node.active = true;
        let rootNodeLen: number = this.node.childrenCount;
        let showNodeArr: cc.Node[] = [];
        for(let i = 0; i < rootNodeLen; i++) {
            for(let j = 0; j < index.length; j++)  {
                if(index[j] - 1 === i) {
                    showNodeArr.push(this.node.children[i]);
                } else {
                    this.node.children[i].active = false;
                    this.node.children[i].opacity = 0;
                }
            }
        }
        for(let i = 0; i < showNodeArr.length; i++) {
            console.log("界面被打开",showNodeArr[i].active," 界面节点的名字是：",showNodeArr[i].name," 透明度为",showNodeArr[i].opacity);
            showNodeArr[i].active = true;
            if(showNodeArr[i].name.indexOf("mask") >= 0) {
                showNodeArr[i].opacity = 125;
            } else {
                showNodeArr[i].opacity = 255;
            }
        }
    }
    private chooseLevel(data: any): void {
        console.log("选择关卡传递过来的数据data is ",data);
        this.setLevel(data.level);
    }
    public setRoot(rootNode: cc.Node) {
        this._root = rootNode;
    }
    public setLevel(level: number): void {
        this.level = level;
    }
    public getLevel(): number {
        return this.level;
    }
    public runScene(sceneNodePrefab: cc.Prefab): void {
        if(this._root) {
            if(this._root.childrenCount > 0) {
                this._root.removeAllChildren();
            }
            // 添加新的场景
            let sceneNode: cc.Node = cc.instantiate(sceneNodePrefab);
            this._root.addChild(sceneNode);
        }
    }

    
}
