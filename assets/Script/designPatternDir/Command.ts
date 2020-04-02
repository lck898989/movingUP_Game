// 命令模式

/***
 * 
 * 
 * 抽象类接口 命令
 * 
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class Command {
    public name: string = "";
    constructor(){

    }
    // 执行
    public abstract execute(): void;
    // 撤销
    public abstract undo(): void;
}
