const {ccclass, property} = cc._decorator;
interface BestRecore {
    level: number,
    time: string
}
@ccclass
export default class User extends cc.Component {
    // 当前玩家所在的关卡
    private level: number = 1;
    // 当前玩家的最好成绩记录
    private bestRecord: BestRecore[] = [{level: 1,time: "00:00"}];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }
    public setBestRecord(level: number,time: string): void {
        let localDataString: any = cc.sys.localStorage.getItem("my");
        console.log("localDataString is ",localDataString);
        let localData: BestRecore[];
        // 取出游戏记录
        if(localDataString && localDataString !== "" && localDataString !== "undefined") {
            localData = <BestRecore[]>JSON.parse(localDataString);
        } else {
            let firstData: BestRecore[] = [];
            firstData.push({level: level,time: time});
            // 创建一个记录
            cc.sys.localStorage.setItem("my",JSON.stringify(firstData));
            console.log("创建首个记录，添加到本地存储了,存储数据是：",cc.sys.localStorage.getItem("my"));
            localData = JSON.parse(cc.sys.localStorage.getItem("my"));
        }
        if(level > 1 && localData && localData.length > 0 && !localData[level - 1]) {
            // 新加记录
            // this.bestRecord.push({level: level,time: time});
            localData.push({level,time});
            cc.sys.localStorage.setItem("my",JSON.stringify(localData));
            console.log("添加到本地存储了,存储数据是：",cc.sys.localStorage.getItem("my"));
        } else {
            if(level >= 1 && localData && localData.length > 0 && localData[level - 1].level === level) {
                // 更新记录（如果新传递进来的时间大于记录的时间不用更新否则更新）
                let curTimeString = localData[level - 1].time;
                if(curTimeString === "00:00") {
                    // 还没有最好成绩直接存储最后成绩
                    localData[level - 1].time = time;
                } else {
                    // 有最好成绩检查是否替换最好成绩
                    if(this.convertTimeStringToNumber(curTimeString) > this.convertTimeStringToNumber(time)) {
                        // 更新
                        localData[level - 1].time = time;
                    } 
                }
                cc.sys.localStorage.setItem("my",JSON.stringify(localData));
            }
        }
        
    }
    // 将字符串类型的时间转换为数字以便进行比较
    private convertTimeStringToNumber(timestring: string): number {
        let res: number = 0;
        let stringArr: string[] = timestring.split(":");
        let minutes: number = Number(stringArr[0]);
        let seconds: number = Number(stringArr[1]);
        res = minutes * 60 + seconds;
        return res;

    }
    public getBestRecord(level: number): BestRecore {
        let res: BestRecore[];
        console.log("本地存储中my is ",cc.sys.localStorage.getItem("my"));
        if(cc.sys.localStorage.getItem("my") === "undefined" || !cc.sys.localStorage.getItem("my")) {
            res = null;
            return null;
        } else {
            res = <BestRecore[]>JSON.parse(cc.sys.localStorage.getItem("my"));
            for(let i = 0; i < res.length; i++) {
                if(res[i].level === level) {
                    return res[i];
                }
            }
        }
    }
    public setLevel(level: number): void {
        this.level = level;
    }
    public getLevel(): number {
        return this.level;
    }
    start () {

    }

    // update (dt) {}
}
