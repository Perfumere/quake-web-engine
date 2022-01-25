/**
 * @file   API便捷操作
 * @author Perfumere
 * @date   2022-01-01
 */

export { AutoTaskQueue, TaskQueue } from './task';
export {
    getType,
    checkType,
    compareType,
    cloneData,
    mixinData,
    freeze,
    pureData,
    default as Util
} from './process';
export { runtime, animate } from './runtime';
export { Unique } from './unique';
