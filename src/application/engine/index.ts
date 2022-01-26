import { EngineReadyState } from './constant';
import {
    _CreateCanvas,
    _CreateBindLayout,
    _InitRenderPass,
    _InitPipeline,
    _InitGPUBuffer,
    _SubmitDrawTask
} from './stage/init';
import { createGPUBuffer, engineCache } from './stage/runtime';
import { runtimeAsync, mixinData, AutoTaskQueue, Unique } from '../utils';
import {
    defaultInitEngineOptions,
    defaultRenderPassOptions
} from './config';

export class EngineBase implements EngineBaseCtor {
    public __engineTag: UniqueKey;
    public __engineReadyState: EngineReadyState = EngineReadyState.UNKNOWN;
    #options: EnginInitOptions;
    #context: GPUCanvasContext;
    #adapter: GPUAdapter;
    #device: GPUDevice;
    #format: GPUTextureFormat;

    constructor(options: EnginInitOptions, tag?: string) {
        this.__engineTag = tag;
        this.__engineReadyState = EngineReadyState.INIT;
        this.#options = mixinData(defaultInitEngineOptions(), options);

        runtimeAsync(async () => {
            const canvas = _CreateCanvas(this.#options.canvasOptions);
            this.#context = canvas.getContext('webgpu');
            this.#adapter = await navigator.gpu.requestAdapter(this.#options.requestAdapterOptions);
            this.#device = await this.#adapter.requestDevice(this.#options.requestDeviceOptions);
            this.#format = this.#options.format || this.#context.getPreferredFormat(this.#adapter);
            this.#context.configure({
                device: this.#device,
                format: this.#format,
                usage: GPUTextureUsage.RENDER_ATTACHMENT
            });
            this.__engineReadyState = EngineReadyState.IDLE;

            if (AutoTaskQueue.has(this.__engineTag)) {
                AutoTaskQueue.get(this.__engineTag).start();
            }
        });
    }

    getOptions() {
        return this.#options;
    }

    getContext() {
        return this.#context;
    }

    getAdapter() {
        return this.#adapter;
    }

    getDevice() {
        return this.#device;
    }

    getFormat() {
        return this.#format;
    }

    getCurrentView() {
        return this.#context.getCurrentTexture().createView();
    }

    createTexture() {
        const canvasOptions = this.#options.canvasOptions;

        return this.#device.createTexture({
            size: [canvasOptions.width, canvasOptions.height, 1],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        }).createView();
    }

    createCommandEncoder() {
        return this.#device.createCommandEncoder();
    }

    createBuffer(mappedArray: TypedArray, options: BufferUsageOptions) {
        mappedArray && createGPUBuffer(this, mappedArray, options);
    }

    drawFrame(options: DrawFrameOptions) {
        AutoTaskQueue.set(
            this.__engineTag,
            [
                () => {
                    const { vertex, renderPassOptions, drawer } = options;
                    const renderOptions = mixinData(defaultRenderPassOptions(), renderPassOptions);
                    const render = _InitRenderPass(this, renderOptions);
                    const bindLayout = _CreateBindLayout(this, renderOptions);
                    _InitPipeline(this, render.renderPassEncoder, renderPassOptions, bindLayout.layout);
                    _InitGPUBuffer(this, render.renderPassEncoder, vertex, bindLayout.uniformGroupLayout);
                    _SubmitDrawTask(this, render, drawer);
                }
            ],
            this.__engineReadyState !== EngineReadyState.IDLE
        );
    }
}

export class Engine implements EngineCtor {
    public __engineTag = Unique.key;

    constructor(options?: EnginInitOptions) {
        engineCache[this.__engineTag] = new EngineBase(options, this.__engineTag);
    }

    /**
     * 获取引擎实例
     */
    getInstance() {
        return engineCache[this.__engineTag];
    }

    /**
     * 绘制图片
     */
    drawFrame(options: DrawFrameOptions) {
        this.getInstance().drawFrame(options);
    }
}
