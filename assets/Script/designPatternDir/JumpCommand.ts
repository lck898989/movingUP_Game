import Command from "./Command";

export default class JumpCommand extends Command {
    constructor() {
        super();
        this.name = "jump";
    }
    // 执行跳跃的命令
    public execute(): void {

    }
    public undo(): void {
        
    }
}