/**
 * @file   浏览器运行时
 * @author Perfumere
 * @date   2022-01-01
 */
import { AutoTaskQueue } from "./task";

/**
 * 获取浏览器运行时
 */
const context: Window = (() => {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    else if (typeof self !== 'undefined') {
        return self;
    }
    else if (typeof window !== 'undefined') {
        return window;
    }
    else {
        return Function('return this')();
    }
}
)();

/********************** runtime status start ***************************/
let runtimeEventBindStatus = false;
const tempTaskQueue: Function[] = [];

/**
 * 传入一个函子, 在DOM加载完成后顺序执行 
 * @param fn 函子
 */
export const runtime = (fn: Function) => {
    if (
        'document' in context
        && ['interactive', 'complete'].includes(document.readyState?.toLowerCase())
    ) {
        AutoTaskQueue.set(Symbol.for('__RUNTIME_TASK__'), [fn], false);
    }
    else if ('addEventListener' in context) {
        if (!runtimeEventBindStatus) {
            runtimeEventBindStatus = true;
            context.addEventListener('DOMContentLoaded', () => {
                if (AutoTaskQueue.has(Symbol.for('__RUNTIME_TASK__'))) {
                    AutoTaskQueue.get(Symbol.for('__RUNTIME_TASK__')).start();
                }

                for (let i = 0; i < tempTaskQueue.length; ++i) {
                    const func = tempTaskQueue.shift();

                    if (typeof func === 'function') {
                        func();
                    }
                }
            });
        }

        AutoTaskQueue.set(Symbol.for('__RUNTIME_TASK__'), [fn]);
    }
};

/**
 * 传入一个函子, 在DOM加载完成后异步执行 
 * @param fn 函子
 */
export const runtimeAsync = (fn: Function) => {
    if (
        'document' in context
        && ['interactive', 'complete'].includes(document.readyState?.toLowerCase())
    ) {
        fn && fn();
    }
    else if ('addEventListener' in context) {
        if (!runtimeEventBindStatus) {
            runtimeEventBindStatus = true;
            context.addEventListener('DOMContentLoaded', () => {
                if (AutoTaskQueue.has(Symbol.for('__RUNTIME_TASK__'))) {
                    AutoTaskQueue.get(Symbol.for('__RUNTIME_TASK__')).start();
                }

                for (let i = 0; i < tempTaskQueue.length; ++i) {
                    const func = tempTaskQueue.shift();

                    if (typeof func === 'function') {
                        func();
                    }
                }
            });
        }

        tempTaskQueue.push(fn);
    }
};
/********************** runtime status end ***************************/


/**
 * 60+FPS动画
 * @param fn 单帧动画函数
 * @param duration 持续时间
 */
export const animate = (fn: Function, duration: number = 1000) => {
    let animationId = 0;
    let start = 0;
    let remains = duration;

    const transform = () => {
        const now = Date.now();
        remains -= now - start;
        start = now;

        fn && fn();

        if (remains < 0) {
            return;
        }

        animationId = requestAnimationFrame(transform);
    }

    return {
        start() {
            start = Date.now();
            cancelAnimationFrame(animationId);
            requestAnimationFrame(transform);
        },
        stop() {
            cancelAnimationFrame(animationId);
        },
        restart(rDuration?: number) {
            remains = rDuration || duration;
            start = Date.now();
            requestAnimationFrame(transform);
        }
    }
}
