
/**
 * @file   引擎初始化
 * @author Perfumere
 * @date   2022-01-01
 */

import { IdxDB } from '@/application/utils/db';

/**
 * 创建画布
 */
export const _CreateCanvas = (options: CanvasInitOptions = {}) => {
    const canvas = document.createElement('canvas');
    canvas.height = options.height;
    canvas.width = options.width;

    if (typeof options.style === 'string' && options.style.trim()) {
        canvas.setAttribute('style', options.style);
    }
    else {
        Object.keys(options.style || {}).forEach(cssKey => {
            canvas.style[cssKey as any] = (options.style as Record<string, string>)[cssKey];
        });
    }

    if (options.target && typeof options.target === 'string') {
        const rootEl = document.querySelector(options.target);
        rootEl?.appendChild(canvas);
    }
    else if (options.target instanceof Element) {
        options.target?.appendChild(canvas);
    }
    else {
        document.body.appendChild(canvas);
    }

    return canvas;
};

/**
 * 初始化数据库
 */
export const _CreateDatabase = () => {
    const DATABASE_LABEL = 'QUAKE_WEB_ENGINE';
    const DATABASE_VERSION = 1;

    const idxDb = new IdxDB(DATABASE_LABEL, DATABASE_VERSION);

    // 纹理存储
    idxDb.createStore(
        'Texture',
        { keyPath: 'name' },
        [
            {
                name: 'version',
                keyPath: 'version',
                unique: true
            }
        ]
    );

    // 模型存储
    idxDb.createStore(
        'Model',
        { keyPath: 'name' },
        [
            {
                name: 'version',
                keyPath: 'version',
                unique: true
            }
        ]
    );

    // 顶点存储
    idxDb.createStore(
        'Vertex',
        { keyPath: 'name' },
        [
            {
                name: 'version',
                keyPath: 'version',
                unique: true
            }
        ]
    );

    // 片元存储
    idxDb.createStore(
        'Fragment',
        { keyPath: 'name' },
        [
            {
                name: 'version',
                keyPath: 'version',
                unique: true
            }
        ]
    );

    return idxDb;
};

/**
 * 初始化渲染通道
 */
export const _InitRenderPass = (engine: EngineBaseCtor, renderPassOptions: RenderPassOptions) => {
    const commandEncoder = engine.getDevice().createCommandEncoder();
    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                view: engine.getCurrentView(),
                loadValue: renderPassOptions.backgroundColor,
                storeOp: 'store'
            }
        ]
    };

    if (renderPassOptions.useDepth) {
        const { canvasOptions } = engine.getOptions();

        renderPassDescriptor.depthStencilAttachment = {
            view: engine.getDevice().createTexture({
                size: [canvasOptions.width, canvasOptions.height],
                format: 'depth24plus',
                usage: GPUTextureUsage.RENDER_ATTACHMENT
            }).createView(),
            ...renderPassOptions.depth
        };
    }

    const renderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    return { commandEncoder, renderPassEncoder };
};

/**
 * 初始化渲染管线
 */
export const _InitPipeline = (
    engine: EngineBaseCtor,
    renderPassEncoder: GPURenderPassEncoder,
    options: RenderPassOptions,
    layout?: GPUPipelineLayout
) => {
    const renderPipeline = engine.getDevice().createRenderPipeline({
        layout,
        vertex: {
            module: engine.getDevice().createShaderModule({ code: options.vxCode }),
            entryPoint: 'main',
            buffers: [
                {
                    arrayStride: 4 * 3,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x3'
                        }
                    ],
                    stepMode: 'vertex'
                },
                {
                    arrayStride: 4 * 3,
                    attributes: [
                        {
                            shaderLocation: 1,
                            offset: 0,
                            format: 'float32x3'
                        }
                    ],
                    stepMode: 'vertex'
                }
            ]
        },
        fragment: {
            module: engine.getDevice().createShaderModule({ code: options.fxCode }),
            entryPoint: 'main',
            targets: [{ format: engine.getFormat() }]
        },
        primitive: {
            topology: options.topology,
            cullMode: options.cullMode
        },
        depthStencil: options.useDepth ? {
            format: 'depth24plus',
            depthWriteEnabled: true,
            depthCompare: 'less'
        } : undefined
    });

    renderPassEncoder.setPipeline(renderPipeline);
};

/**
 * 创建BindLayout
 */
export const _CreateBindLayout = (engine: EngineBaseCtor, options: RenderPassOptions) => {
    if (!options.bindGroup || !options.bindGroup.length) {
        return {};
    }

    const uniformGroupLayout = engine.getDevice().createBindGroupLayout({
        entries: options.bindGroup.map((item, index) => ({
            binding: index,
            visibility: item.visibility || GPUShaderStage.VERTEX,
            buffer: item.buffer || { type: 'uniform' }
        }))
    });
    const layout = engine.getDevice().createPipelineLayout({
        bindGroupLayouts: [uniformGroupLayout]
    });

    return { layout, uniformGroupLayout }
};

/**
 * 设置缓存
 */
export const _InitGPUBuffer = (
    engine: EngineBaseCtor,
    render: GPURenderPassEncoder,
    vertex: DrawFrameOptions['vertex'],
    uniformGroupLayout: GPUBindGroupLayout
) => {
    engine.createBuffer(
        vertex.position,
        {
            render,
            usage: GPUBufferUsage.VERTEX,
            slot: 0
        }
    );

    if (vertex.color) {
        engine.createBuffer(
            vertex.color,
            {
                render,
                usage: GPUBufferUsage.VERTEX,
                slot: 1
            }
        );
    }

    if (vertex.index) {
        engine.createBuffer(
            vertex.index,
            {
                render,
                usage: GPUBufferUsage.INDEX
            }
        );
    }

    if (uniformGroupLayout && vertex.mvpMat) {
        engine.createBuffer(
            vertex.mvpMat,
            {
                render,
                usage: GPUBufferUsage.UNIFORM,
                index: 0,
                uniformGroupLayout
            }
        );
    }
};

/**
 * 提交绘制任务
 */
export const _SubmitDrawTask = (
    engine: EngineBaseCtor,
    render: {
        commandEncoder: GPUCommandEncoder;
        renderPassEncoder: GPURenderPassEncoder;
    },
    drawer: DrawFrameOptions['drawer']
) => {
    render.renderPassEncoder[drawer.name](drawer.count, 1, 0, 0);
    render.renderPassEncoder.endPass();
    engine.getDevice().queue.submit([render.commandEncoder.finish()]);
};
