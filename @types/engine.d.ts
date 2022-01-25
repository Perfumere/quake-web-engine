interface CanvasInitOptions {
    target?: string | HTMLElement;
    height?: number;
    width?: number;
    style?: string | Record<string, string>;
}

interface RenderPassDepth {
    depthLoadValue: GPURenderPassDepthStencilAttachment['depthLoadValue'];
    depthStoreOp: GPURenderPassDepthStencilAttachment['depthStoreOp'];
    stencilLoadValue: GPURenderPassDepthStencilAttachment['stencilLoadValue'];
    stencilStoreOp: GPURenderPassDepthStencilAttachment['stencilStoreOp'];
}

interface RenderPassOptions {
    vxCode: string;
    fxCode: string;
    topology?: GPUPrimitiveTopology;
    cullMode?: GPUCullMode;
    useDepth?: boolean;
    backgroundColor?: GPUColorDict;
    depth?: RenderPassDepth;
    bindGroup?: GPUBindGroupLayoutEntry[];
}

interface DefaultInitEngineOptions {
    format: GPUTextureFormat;
    requestAdapterOptions: GPURequestAdapterOptions;
    requestDeviceOptions: GPUDeviceDescriptor;
    canvasOptions: CanvasInitOptions;
}

interface EnginInitOptions {
    format?: GPUTextureFormat;
    requestAdapterOptions?: GPURequestAdapterOptions;
    requestDeviceOptions?: GPUDeviceDescriptor;
    canvasOptions?: CanvasInitOptions;
}

interface DrawFrameOptions {
    vertex: {
        position: TypedArray;
        color?: TypedArray;
        index?: TypedArray;
        mvpMat?: TypedArray;
    },
    drawer: {
        name: 'draw' | 'drawIndexed';
        count: number;
    };
    renderPassOptions?: RenderPassOptions;
}

interface EngineBaseCtor {
    __engineTag: UniqueKey;
    __engineReadyState: number;

    getOptions: () => EnginInitOptions;
    createBuffer: (mappedArray: TypedArray, options: BufferUsageOptions) => void;
    getContext: () => GPUCanvasContext;
    getAdapter: () => GPUAdapter;
    getDevice: () => GPUDevice;
    getFormat: () => GPUTextureFormat;
    getCurrentView: () => GPUTextureView;
    createTexture: () => GPUTextureView;
    createCommandEncoder: () => GPUCommandEncoder;
    drawFrame: (options: DrawFrameOptions) => void;
}

interface EngineCtor {
    __engineTag: UniqueKey;

    getInstance: () => EngineBaseCtor;
    drawFrame: (options: DrawFrameOptions) => void;
}

interface BufferUsageVertex {
    render: GPURenderPassEncoder;
    usage?: GPUBufferUsage['VERTEX'];
    slot?: number;
    offset?: number;
    size?: number;
}

interface BufferUsageIndex {
    render: GPURenderPassEncoder;
    usage?: GPUBufferUsage['INDEX'];
    indexFormat?: GPUIndexFormat;
    offset?: number;
    size?: number;
}

interface BufferUsageUniform {
    render: GPURenderPassEncoder;
    usage?: GPUBufferUsage['UNIFORM'];
    index?: number;
    uniformGroupLayout?: GPUBindGroupLayout;
}

type BufferUsageOptions = BufferUsageVertex | BufferUsageIndex | BufferUsageUniform;
