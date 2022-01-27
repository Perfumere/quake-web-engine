/**
 * @file   线程处理工具
 * @author Perfumere
 * @date   2022-01-27
 */

// 最大线程数量
const MAX_NUM_OF_THREAD = navigator.hardwareConcurrency - 1;

// 线程池
const workerPoll: Map<string, Worker> = new Map();

/**
 * 根据传入的函数创建Worker实例
 * @param fn {Function} 创建Worker时需要的处理函数
 * @returns url URL.createObjectURL() 生成的临时URL
 */
const _CreateWorker = (fn: Function) => {
    if (workerPoll.size >= MAX_NUM_OF_THREAD) {
        return '';
    }

    const url = URL.createObjectURL(
        new Blob([`(${fn.toString()})()`], { type: 'application/javascript' })
    );

    workerPoll.set(url, new Worker(url));

    return url;
};

/**
 * 通过URL关闭Worker
 * @param url {string} URL.createObjectURL() 生成的临时URL
 */
const _CloseWorker = (url: string) => {
    if (!workerPoll.has(url)) {
        return;
    }

    workerPoll.get(url).terminate();
    URL.revokeObjectURL(url);
    workerPoll.delete(url);
};

export class WorkerCtrl {
    #addr: string;

    constructor(fn: Function) {
        this.#addr = _CreateWorker(fn);
    }

    /**
     * 关闭线程
     */
    terminate() {
        _CloseWorker(this.#addr);
    }

    /**
     * 通知线程
     * @param message  需要传递的数据
     * @param transfer 可按引用传递的数据列表
     */
    postMessage(message: any, transfer: Transferable[]) {
        workerPoll.get(this.#addr).postMessage(message, transfer);
    }

    /**
     * 为线程添加监听事件
     * @param type 事件名称
     * @param listener 事件处理器
     * @param options 配置选项
     */
    addEventListener(
        type: keyof WorkerEventMap,
        listener: (this: Worker, ev: MessageEvent<any> | ErrorEvent) => any,
        options?: boolean | AddEventListenerOptions
    ) {
        workerPoll.get(this.#addr).addEventListener(type, listener, options);
    }

    /**
     * 为线程移除监听事件
     * @param type 事件名称
     * @param listener 事件处理器
     * @param options 配置选项
     */
    removeEventListener(
        type: any,
        listener: (this: Worker, ev: any) => any,
        options?: boolean | EventListenerOptions
    ) {
        workerPoll.get(this.#addr).removeEventListener(type, listener, options);
    }

    /**
     * 处理监听事件
     */
    get onmessage() {
        return workerPoll.get(this.#addr).onmessage;
    }
    set onmessage(fn: (this: Worker, ev: MessageEvent<any>) => any) {
        workerPoll.get(this.#addr).onmessage = fn;
    }
    get onerror() {
        return workerPoll.get(this.#addr).onerror;
    }
    set onerror(fn: (this: AbstractWorker, ev: ErrorEvent) => any) {
        workerPoll.get(this.#addr).onerror = fn;
    }
}
