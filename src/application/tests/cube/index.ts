import vxCode from './vxCode.wgsl';
import fxCode from './fxCode.wgsl';
import { mat4 } from 'gl-matrix';
import { CreateViewProjection, CreateTransforms } from '../../engine/utils/calc';

const position = new Float32Array([
    // front
    -1, -1,  1,  
     1, -1,  1,  
     1,  1,  1,
     1,  1,  1,
    -1,  1,  1,
    -1, -1,  1,

    // right
     1, -1,  1,
     1, -1, -1,
     1,  1, -1,
     1,  1, -1,
     1,  1,  1,
     1, -1,  1,

    // back
    -1, -1, -1,
    -1,  1, -1,
     1,  1, -1,
     1,  1, -1,
     1, -1, -1,
    -1, -1, -1,

    // left
    -1, -1,  1,
    -1,  1,  1,
    -1,  1, -1,
    -1,  1, -1,
    -1, -1, -1,
    -1, -1,  1,

    // top
    -1,  1,  1,
     1,  1,  1,
     1,  1, -1,
     1,  1, -1,
    -1,  1, -1,
    -1,  1,  1,

    // bottom
    -1, -1,  1,
    -1, -1, -1,
     1, -1, -1,
     1, -1, -1,
     1, -1,  1,
    -1, -1,  1
]);

const color = new Float32Array([
    // front - blue
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // right - red
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    //back - yellow
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,

    //left - aqua
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,

    // top - green
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // bottom - fuchsia
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1
]);


// create uniform data
const modelMatrix = mat4.create();
CreateTransforms(
    modelMatrix,
    [0, 0, 0],
    [90 / 180 * Math.PI, 0, 0],
    [0.8, 0.8, 0.8]
);
const vpMatrix = CreateViewProjection().viewProjectionMatrix;
mat4.multiply(vpMatrix, vpMatrix ,modelMatrix);

export default {
    vertex: {
        position,
        color,
        mvpMat: vpMatrix
    },
    drawer: {
        name: 'draw',
        count: 36
    },
    renderPassOptions: {
        vxCode,
        fxCode,
        useDepth: true,
        bindGroup: [ { binding: 0 } ]
    }
} as DrawFrameOptions;
