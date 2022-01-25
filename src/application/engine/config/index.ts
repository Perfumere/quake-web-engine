/**
 * @file   默认配置
 * @author Perfumere
 * @date   2022-01-01
 */

// 引擎初始化
export const defaultInitEngineOptions = () => ({
    format: 'bgra8unorm',
    requestAdapterOptions: {
        powerPreference: 'high-performance'
    },
    requestDeviceOptions: null,
    canvasOptions: {
        width: 600,
        height: 600
    }
} as DefaultInitEngineOptions);

// 渲染通道初始化
export const defaultRenderPassOptions = () => ({
    backgroundColor: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
    vxCode: '',
    fxCode: '',
    topology: 'triangle-list',
    cullMode: 'back',
    drawMode: 'draw',
    useDepth: false,
    depth: {
        depthLoadValue: 1.0,
        depthStoreOp: 'store',
        stencilLoadValue: 0,
        stencilStoreOp: 'store'
    }
} as RenderPassOptions);
