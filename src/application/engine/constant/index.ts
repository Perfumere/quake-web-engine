/**
 * @file   引擎常量
 * @author Perfumere
 * @date   2022-01-01
 */

/**
 * 引擎实例的状态
 * 0 状态未知
 * 1 即将初始化
 * 2 工作中
 * 3 闲置可用
 */
export enum EngineReadyState {
    UNKNOWN,
    INIT,
    BUSY,
    IDLE
}
