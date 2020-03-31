import ResourceManager from "./managers/ResourceManager";
import SceneManager from "./SceneManager";
import User from "./users/User";

const {ccclass, property} = cc._decorator;
enum Direction {
    LEFT,
    UP,
    RIGHT,
    DOWN,
    NONE
}
enum GameState {
    INIT,
    BEGIN,
    END
}
@ccclass
export default class Game extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property({type: cc.Node})
    board: cc.Node = null;
    @property({type: cc.Node})
    ball: cc.Node = null;
    @property({type: cc.Node})
    ballp: cc.Node = null;
    @property({type: cc.Prefab})
    hole: cc.Prefab = null;
    @property({type: cc.AudioClip})
    ballFallAudio: cc.AudioClip = null;
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Camera)
    mainCamera: cc.Camera = null;
    @property(cc.Prefab)
    holeWin: cc.Prefab = null;
    @property(cc.Prefab)
    holeLose: cc.Prefab = null;
    @property(cc.Node)
    holeCon: cc.Node = null;
    @property(cc.Node)
    overMenu: cc.Node = null;
    @property(cc.Node)
    boardTouch: cc.Node = null;

    private speed: number = 1;
    
    private canMove: boolean = true;

    private dir: Direction = Direction.NONE;
    private over: boolean = false;
    private curState: GameState = GameState.INIT;
    // 小球是否下落完毕
    private ballIsDown: boolean = false;
    private levelData: any = null;

    private startTime: boolean = false;
    private timeUsed: number = 0;
    

    private gridMap: cc.Vec2[][];
    private readonly gridWidth: number = 70;
    private readonly gridHeight: number = 70;

    private loseHolePool: cc.NodePool = null;
    private poolDeep: number = 40;

    private holeWinNode: cc.Node = null;
    private startPosition: cc.Vec2 = cc.v2(0,0);

    private moving: boolean = false;

    async onLoad () {
        // this.overMenu.active = false;
        this.gridMap = [];
        cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
        cc.director.getPhysicsManager().enabled = true;
        let self = this;
        console.log("bg is ",this.bg);
        let sceneManager: SceneManager = <SceneManager>cc.find("Controller").getComponent("SceneManager");
        let levelStr: string = sceneManager.getLevel().toString();
        this.levelLabel.string = "level" + levelStr;
        // 加载关卡数据
        let levelData: cc.JsonAsset = await ResourceManager.getInstance().loadResourceByUrl(`level${levelStr}`,cc.JsonAsset);
        this.levelData = levelData.json;
        console.log("levelData is ",this.levelData);
        cc.director.on("ballToHole",this.overHandle,this);
        cc.director.on("ballToBoard",this.ballToBoardHandle,this);
        cc.director.on("ballToLand",this.ballToLandHandle,this);
        // 添加移动端事件监听
        this.node.on("touchstart",this.tapStart,this);
        this.node.on("touchend",this.tapEnd,this);
       
        this.boardTouch.on("touchstart",this.tapBoard,this);
        this.boardTouch.on("touchmove",this.tapMove,this);
        this.boardTouch.on("touchend",this.tapBoardEnd,this);
        this.boardTouch.on(cc.Node.EventType.TOUCH_CANCEL,this.tapBoardEnd,this);

        // 初始化相关代码
        this.initHoleGrid();
        this.initHolePoolForLose();
        this.initHole();
        console.log("gridMap is ",this.gridMap);

        // cc.tween(this.holeWinNode).to({
        //     y: self.holeWinNode.height
        // })
    }
    // 初始化洞穴网格
    private initHoleGrid(): void {
        if(this.levelData) {
            // 列
            let col: number = this.levelData.col;
            // 行
            let row: number = this.levelData.row;
            for(let i = 0; i < row; i++) {
                this.gridMap[i] = [];
                for(let j = 0; j < col; j++) {
                    let pos: cc.Vec2 = new cc.Vec2();
                    pos.x = this.gridWidth / 2 + j * this.gridWidth;
                    pos.y = this.gridHeight / 2 + i * this.gridHeight;
                    this.gridMap[i].push(pos);
                    // this.gridMap[i][j] = pos;
                }
            }
        }
    }
    // 初始化失败洞穴节点池
    private initHolePoolForLose(): void {
        this.loseHolePool = new cc.NodePool();
        for(let i = 0; i < this.poolDeep; i++) {
            let loseNode: cc.Node = cc.instantiate(this.holeLose);
            this.loseHolePool.put(loseNode);
            // this.holeCon.addChild(loseNode);
        }
    }
    // 初始化终点洞穴,障碍洞穴
    private initHole(): void {
        if(this.levelData) {
            let objects: any[] = this.levelData.objects;
            for(let i = 0; i < objects.length; i++) {
                if(i === 0) {
                    // 初始化终点洞穴
                    let posObj: any = objects[i].pos;
                    this.holeWinNode = cc.instantiate(this.holeWin);
                    this.holeCon.addChild(this.holeWinNode);
                    this.holeWinNode.setPosition(this.gridMap[posObj.row][posObj.col]);
                    this.holeWinNode.scale = Number(objects[i].scaleMultiplier);
                } else {
                    let posObj: any = objects[i].pos;
                    let loseHoleNode: cc.Node = this.loseHolePool.get();
                    console.log("从节点池中获取的节点是：",loseHoleNode);
                    if(loseHoleNode) {
                        loseHoleNode.setPosition(this.gridMap[posObj.row][posObj.col]);
                        this.holeCon.addChild(loseHoleNode);
                    }
                }
            }
        }
        // this.ball.zIndex = this.ball.parent
    }
    // 球碰到地板了说明是掉下去了游戏结束
    private ballToLandHandle(): void {
        this.startTime = false;
        this.overMenu.getChildByName("tryLabel").getComponent(cc.Label).string = "TRY AGAIN";
        let inName: string = this.overMenu.getComponent(cc.Animation).getClips()[0].name;
        this.overMenu.getComponent(cc.Animation).play(inName);
        this.over = true;
    }
    // 游戏结束
    private async overHandle(data: any) {
        this.startTime = false;
        if(data.over === "win") {
            console.log("开始播放游戏场景动画");
            await this.ballToHoleHandle(this.holeWinNode);
            console.log("游戏场景动画播放完毕");
            console.log("开始播放结束菜单动画");
            if(this.over) {
                this.overMenu.getChildByName("tryLabel").getComponent(cc.Label).string = "SUCCESS";
                this.overMenu.getChildByName("successCon").active = true;
                let successLabel: cc.Label = <cc.Label>this.overMenu.getChildByName("successCon").getChildByName("time").getComponent(cc.Label);
                let bestTimeString: string  = this.updateTimeByTotalTime(this.timeUsed,successLabel);
    
                let inName: string = this.overMenu.getComponent(cc.Animation).getClips()[0].name;
                this.overMenu.getComponent(cc.Animation).play(inName);
                // 记录该用户最好成绩
                let userCom: User = <User>cc.find("Controller").getComponent("User");
                userCom.setBestRecord(Number(cc.find("Controller").getComponent("SceneManager").getLevel().toString()),bestTimeString);
            }
            
        } else if(data.over === "lose") {
            await this.ballToHoleHandle(data.node);
            console.log("游戏失败");
            // this.overMenu.active = true;
            this.overMenu.getChildByName("tryLabel").getComponent(cc.Label).string = "TRY AGAIN";
            let inName: string = this.overMenu.getComponent(cc.Animation).getClips()[0].name;
            this.overMenu.getComponent(cc.Animation).play(inName);
        }
        
    }
    private ballToBoardHandle(): void {
        let self = this;
        if(!self.ballIsDown) {
            self.ballIsDown = true;
            self.levelLabel.string = "00:00";
            cc.tween(this.ballp).to(0.5,{
                opacity: 0
            }).start();
            let scaleAnim: cc.AnimationClip = self.levelLabel.node.getComponent(cc.Animation).getClips()[1];
            self.levelLabel.node.getComponent(cc.Animation).play(scaleAnim.name);
            cc.audioEngine.play(self.ballFallAudio,false,0.5);
        }
    }
    private set CurState(state: GameState) {
        switch(state) {
            case GameState.INIT:
                this.curState = GameState.INIT;
                break;
            case GameState.BEGIN:
                this.curState = GameState.BEGIN;
                break;
            case GameState.END:
                this.curState = GameState.END;
                this.gameOver();
                break;
        }
    }
    private gameOver(): void {
        this.canMove = false;
        this.over = true;
        this.Dir = Direction.NONE;
        this.startTime = false;
    }
    // start 函数
    start () {
        // cc.audioEngine.playMusic(this.bgm,true);
        let self = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

    }
    private async ballToHoleHandle(targetNode: cc.Node): Promise<any> {
        let self = this;
        if(!self.over) {
            // 关闭物理系统
            this.ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
            cc.director.getPhysicsManager().enabled = false;
            let worldPosition: cc.Vec2 = self.holeCon.convertToWorldSpace(cc.v2(targetNode.x,targetNode.y));
            let localPosition: cc.Vec2 = self.node.convertToNodeSpaceAR(worldPosition);
            return new Promise((resolve,reject) => {
                cc.tween(self.ball).to(0.3,{
                    x: localPosition.x,
                    y: localPosition.y
                }).call(() => {
                    console.log("游戏结束");
                    cc.tween(self.ball).to(0.2,{
                        scale: 0
                    }).call(() => {
                        self.CurState = GameState.END;
                        resolve();
                    }).start();
                }).start();
                self.board.getComponent(cc.Animation).play("boardW");
                if(targetNode.group === "holewin") {
                    let winAnimName: string = self.holeWinNode.getComponent(cc.Animation).getClips()[2].name;
                    self.holeWinNode.getComponent(cc.Animation).play(winAnimName);
                }
            });
            // cc.director.emit("over");
        }
    }
    set Dir(dir: Direction) {
        switch(dir) {
            case Direction.LEFT:
                this.dir = Direction.LEFT;
                break;
            case Direction.RIGHT:
                this.dir = Direction.RIGHT;
                break;
            case Direction.UP:
                this.dir = Direction.UP;
                break;
            case Direction.DOWN:
                this.dir = Direction.DOWN;
                break;
            case Direction.NONE:
                this.dir = Direction.NONE;
                break;    
        }
    }
    private tapStart(e: cc.Event.EventTouch): void {
        this.startTime = true;
        if(e.getLocation().x > this.node.width / 2) {
            this.Dir = Direction.RIGHT;
        } else if(e.getLocation().x < this.node.width / 2) {
            this.Dir = Direction.LEFT;
        }
    }
    private tapBoard(e: cc.Event.EventTouch): void {
        this.startTime = true;
        console.log("e.target is ",e.target," name is ",e.target.name);
        e.stopPropagation();
        if(e.target.name === "boardTouch") {
            this.startPosition = e.getLocation();
        }
    }
    private tapMove(e: cc.Event.EventTouch): void {
        this.moving = true;
        if(this.startPosition.x !== 0 && this.startPosition.y !== 0) {
            if((this.startPosition.y - e.getLocation().y) >= 0) {
                this.Dir = Direction.DOWN;
            } else if((this.startPosition.y - e.getLocation().y) <= 0) {
                this.Dir = Direction.UP;
            }
        }
    }
    private tapBoardEnd(e: cc.Event.EventTouch): void {
        
        this.Dir = Direction.NONE;
        this.moving = false;
    }
    private tapEnd(): void {
        this.Dir = Direction.NONE;
        this.moving = false;
    }
    private onKeyDown(e: cc.Event.EventKeyboard): void {
        console.log(e.keyCode);
        if(this.canMove) {
            this.startTime = true;
            switch(e.keyCode) {
                case 37:
                    this.Dir = Direction.LEFT;
                    cc.director.emit("none");
                    break;
                case 38:
                    this.Dir = Direction.UP;
                    cc.director.emit("up");
                    break;
                case 39:
                    this.Dir = Direction.RIGHT;
                    cc.director.emit("none");
                    // this.board.angle -= 
                    break;
                case 40:
                    cc.director.emit("down");
                    this.Dir = Direction.DOWN;
                    break;            
            }
        }
    }
    private onKeyUp(e: cc.Event.EventKeyboard): void {
        this.Dir = Direction.NONE;
        cc.director.emit("none");
    }
    onDestroy(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.director.off("ballToHole",this.ballToHoleHandle,this);
        cc.director.off("ballToBoard",this.ballToBoardHandle,this);

        this.node.off("touchstart",this.tapStart,this);
        this.node.off("touchend",this.tapEnd,this);
       
        this.board.off("touchstart",this.tapBoard,this);
        this.board.off("touchmove",this.tapMove,this);
        this.board.off("touchend",this.tapEnd,this);
        
    }
    private updateLevelOrTime(dt: number): void {
        let self = this;
        if(self.startTime) {
            self.timeUsed += dt;
            // self.timeUsed = Math.floor(self.timeUsed);
            this.updateTimeByTotalTime(self.timeUsed,self.levelLabel);
        }
    }
    private updateTimeByTotalTime(totalTime: number,targetLabel: cc.Label): string {
        let self = this;
        let resString: string = "";
        let minutes: number = Math.floor(totalTime / 60);
        let seconds: number = Math.floor(totalTime % 60);
        if(minutes < 10) {
            if(seconds < 10) {
                targetLabel.string = `0${minutes}:0${seconds}`;
            } else {
                targetLabel.string = `0${minutes}:${seconds}`;
            }
        } else {
            if(seconds < 10) {
                targetLabel.string = `${minutes}:0${seconds}`;
            } else {
                targetLabel.string = `${minutes}:${seconds}`;
            }
        }
        resString = targetLabel.string;
        return resString;
    }
    update (dt) {
        let self = this;
        this.updateLevelOrTime(dt);
        switch(this.dir) {
            case Direction.LEFT:
                if(this.board.angle <= 20) {
                    this.board.angle += this.speed;
                }
                break;
            case Direction.RIGHT:
                if(this.board.angle >= -20) {
                    this.board.angle -= this.speed;
                }
                break;
            case Direction.UP:
                this.board.y += dt * 200;
                this.mainCamera.node.y += dt * 200;
                break;
            case Direction.DOWN:
                this.board.y -= dt * 200;
                this.mainCamera.node.y -= dt * 200;
                break;
        }
    }
}
