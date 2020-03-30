import User from "../users/User";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {

    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(cc.Label)
    bestLabel: cc.Label = null;

    start () {
        let userCom: User = <User>cc.find("Controller").getComponent("User");
        let bestRecord: {level: number,time: string} = userCom.getBestRecord(Number(this.levelLabel.string));
        if(bestRecord) {
            this.bestLabel.string = bestRecord.time;
        }
    }
    public getLevel(): string {
        return this.levelLabel.string;
    }
    public setLevel(str: string|number): void {
        this.levelLabel.string = str.toString();
    }
    public getBest(): string {
        return this.bestLabel.string;
    }
    public setBest(best: string|number): void {
        this.bestLabel.string = best.toString();
    }
    btnEvent(e: cc.Event,data: any): void {
        cc.director.emit("levelChoose",{level: Number(this.levelLabel.string)});
        cc.director.loadScene("Game");
    }
    update (dt) {}
    onDestroy(): void {

    }
}
