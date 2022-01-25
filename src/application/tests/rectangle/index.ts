import vxCode from './vxCode.wgsl';
import fxCode from './fxCode.wgsl';

// 顶点坐标
const position = new Float32Array([
    -0.5, -0.5, 0, // vertex a, index = 0
     0.5, -0.5, 0, // vertex b, index = 1
     0.5,  0.5, 0, // vertex c, index = 2  
     0.5,  0.5, 0, // vertex c, index = 3  
    -0.5,  0.5, 0, // vertex c, index = 4  
 ]);
// const position = new Float32Array([
//    -0.5, -0.5, 0, // vertex a, index = 0
//     0.5, -0.5, 0, // vertex b, index = 1
//     0.5,  0.5, 0, // vertex c, index = 2  
//    -0.5,  0.5, 0  // vertex d, index = 3        
// ]);

// 顶点颜色
const color = new Float32Array([
    1, 0, 1,  // vertex a, index = 0
    .2, 1, 1,  // vertex b, index = 1
    0, 0, 1,  // vertex c, index = 2
    1, 1, 0,  // vertex c, index = 3
    1, 1, 0,  // vertex c, index = 3
]);
// const color = new Float32Array([
//     1, 0, 0,  // vertex a, index = 0 red
//     0, 1, 0,  // vertex b, index = 1 green
//     0, 0, 1,  // vertex c, index = 2 blue
//     1, 1, 1   // vertex d, index = 3 white   
// ]);

// 顶点索引
// const index = new Uint32Array([0, 1, 3, 3, 1, 2]);
const index = new Uint32Array([0, 1, 2, 2, 4, 0]);

export default {
    vertex: {
        position,
        color,
        index
    },
    drawer: {
        name: 'drawIndexed',
        count: 6,
    },
    renderPassOptions: {
        vxCode,
        fxCode
    }
} as DrawFrameOptions;
