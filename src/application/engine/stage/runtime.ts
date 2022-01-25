
import { freeze, pureData } from '../../utils';

// 引擎实例缓存
export const engineCache: Record<string, EngineBaseCtor> = pureData({});

/**
 * GPU缓冲区映射至渲染通道
 */
const BUFFER_USAGE_MAP: Record<GPUBufferUsageFlags, Function> = freeze({
    [GPUBufferUsage.VERTEX]: (engine: EngineBaseCtor, buffer: GPUBuffer, options: BufferUsageVertex) => {
        const { render, slot, offset, size } = options;
        render.setVertexBuffer(slot, buffer, offset, size);
    },
    [GPUBufferUsage.INDEX]: (engine: EngineBaseCtor, buffer: GPUBuffer, options: BufferUsageIndex) => {
        const { render, indexFormat, offset, size } = options;
        render.setIndexBuffer(buffer, indexFormat || 'uint32', offset, size);
    },
    [GPUBufferUsage.UNIFORM]: (engine: EngineBaseCtor, buffer: GPUBuffer, options: BufferUsageUniform) => {
        const { render, index, uniformGroupLayout } = options;
        const uniformBindGroup = engine.getDevice().createBindGroup({
            layout: uniformGroupLayout,
            entries: [{
                binding: index,
                resource: { buffer }
            }]
        } );
        render.setBindGroup(index, uniformBindGroup);
    }
});

/**
 * 设置GPU缓冲区
 */
export const malloc = (
    device: GPUDevice,
    typeArray: TypedArray,
    usageFlag: GPUBufferUsageFlags = GPUBufferUsage.VERTEX
) => {
    const gupBuffer = device.createBuffer({
        size: typeArray.byteLength,
        usage: usageFlag | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    });
    const constructor = typeArray.constructor as new (buffer: ArrayBuffer) => TypedArray;
    const view = new constructor(gupBuffer.getMappedRange());

    view.set(typeArray, 0);
    gupBuffer.unmap();

    return gupBuffer;
}

/**
 * 映射GPU缓冲区至渲染通道
 */
export const createGPUBuffer = (
    engine: EngineBaseCtor,
    typeArray: TypedArray,
    options: BufferUsageOptions
) => {
    const buffer = malloc(engine.getDevice(), typeArray, options.usage);

    if (BUFFER_USAGE_MAP[options.usage]) {
        BUFFER_USAGE_MAP[options.usage](engine, buffer, options);
    }

    return buffer;
}
