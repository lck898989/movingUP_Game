import Command from "./Command";

export default class UpCommand extends Command{
    constructor() {
        super();
        this.name = "up";
    }
    // 执行对应的命令
    public execute(): void {

    }
    public undo(): void {
        
    }
}