import vxCode from './vxCode.wgsl';
import fxCode from './fxCode.wgsl';

// 顶点坐标
const position = new Float32Array([
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
]);

// 顶点颜色
const color = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
]);

// 顶点索引
const index = new Uint32Array([0, 1, 2]);

export default {
    vertex: {
        position,
        color,
        index
    },
    drawer: {
        name: 'drawIndexed',
        count: 3
    },
    renderPassOptions: {
        vxCode,
        fxCode
    }
} as DrawFrameOptions;
