

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
    }
    public onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        // console.log('on collision enter');
        // console.log(`self is ${self}`,self);
        // console.log(`other is ${other}`,other);
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;
        if(other.name.indexOf("board") >= 0) {
            cc.director.emit("ballToBoard",{other,self});
        }
        console.log("other.name is ",other.name);
        
        if(other.node.group === "holewin") {
            console.log("碰到黑洞了");
            cc.director.emit("ballToHole",{over: "win"});
        }
        if(other.node.group === "holelose") {
            console.log("游戏结束碰到了假的黑洞");
            cc.director.emit("ballToHole",{over: "lose",node: other.node});
        }
        if(other.name.indexOf("cp") >= 0) {
            cc.director.emit("ballToLand",{other,self});
        }
    }
    start () {

    }

    update (dt) {
        // console.log("物理系统状态",cc.director.getPhysicsManager().enabled);
        console.log("ball.y is ",this.node.y);
    }
}
