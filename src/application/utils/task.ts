/**
 * @file   自动任务队列
 * @author Perfumere
 * @date   2022-01-01
 */

export class TaskQueue extends Array {
    static actions: Record<UniqueKey, ActionRecord> = Object.create(null);
    private action: UniqueKey;

    constructor(action: UniqueKey) {
        super();
        TaskQueue.actions[action] = {
            status: false,
            ret: 0
        };
        this.action = action;
    }

    async shift() {
        TaskQueue.actions[this.action].ret += 1;

        // caller数量大于1 - 退出
        if (TaskQueue.actions[this.action].ret > 1) {
            TaskQueue.actions[this.action].ret = 1;
            return;
        }

        // 任务 - 进行态
        if (this.length) {
            const func = Array.prototype.shift.call(this);
            try { await func(); } catch { /* None */ }

            // 任务完成 - 吊起下一个任务
            TaskQueue.actions[this.action].ret -= 1;
            this.shift();
        }

        // 任务 - 完成态
        else {
            TaskQueue.actions[this.action].status = false;
            TaskQueue.actions[this.action].ret = 0;
        }
    }

    push(...args: Function[]): number {
        const length = this.silencePush(...args);
        this.start();

        return length;
    }

    silencePush(...args: Function[]): number {
        args.forEach((cb: Function) => Array.prototype.push.call(this, cb));
        return args.length;
    }

    stop() {
        TaskQueue.actions[this.action].ret = 2;
        TaskQueue.actions[this.action].status = false;
    }

    start() {
        if (this.length && !TaskQueue.actions[this.action].status) {
            TaskQueue.actions[this.action].ret = 0;
            TaskQueue.actions[this.action].status = true;
            this.shift();
        }
    }
}

export class AutoTaskQueue {
    static task: Record<UniqueKey, TaskQueue> = Object.create(null);

    static has(action: UniqueKey) {
        return action in AutoTaskQueue.task;
    }

    static get(action: UniqueKey) {
        return AutoTaskQueue.task[action];
    }

    static set(action: UniqueKey, task: Function[], silence: boolean = true) {
        if (!AutoTaskQueue.has(action)) {
            AutoTaskQueue.task[action] = new TaskQueue(action);
        }
        if (silence) {
            AutoTaskQueue.task[action].silencePush(...task);
        }
        else {
            AutoTaskQueue.task[action].push(...task);
        }
    }
}