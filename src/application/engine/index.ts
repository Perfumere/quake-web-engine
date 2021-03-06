import { EngineReadyState } from './constant';
import {
    _CreateCanvas,
    _CreateBindLayout,
    _InitRenderPass,
    _InitPipeline,
    _InitGPUBuffer,
    _SubmitDrawTask,
    _CreateDatabase
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
    #db: IdxDBCtor;

    constructor(options: EnginInitOptions, tag?: string) {
        this.__engineTag = tag;
        this.__engineReadyState = EngineReadyState.INIT;
        this.#options = mixinData(defaultInitEngineOptions(), options);
        this.#db = _CreateDatabase();

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

    getDataBase() {
        return this.#db;
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
     * ??????????????????
     */
    getInstance() {
        return engineCache[this.__engineTag];
    }

    /**
     * ??????????????????
     */
    createTextureFromSource(device: GPUDevice, source: ImageBitmap | HTMLCanvasElement) {
        const textureDescriptor: GPUTextureDescriptor = {

            // also [ width, height ],
            size: { width: source.width, height: source.height },

            // also canvas.getContext('webgpu').getPreferredFormat(adapter),
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING
                | GPUTextureUsage.COPY_DST
                | GPUTextureUsage.RENDER_ATTACHMENT
        };

        const texture = device.createTexture(textureDescriptor);

        device.queue.copyExternalImageToTexture({ source }, { texture }, textureDescriptor.size);

        return texture;
    }

    async createImageTexture(url: string) {
        const database = engineCache[this.__engineTag].getDataBase();
        const cacheBlob = await database.findById('Texture', url);
        let blob: Blob;

        if (cacheBlob && typeof cacheBlob === 'object') {
            blob = cacheBlob.blob;
        }
        else {
            const response = await fetch(url);
            blob = await response.blob();
            database.store('Texture', { name: url, version: 1, blob });
        }

        const imgBitmap = await createImageBitmap(blob);

        return this.createTextureFromSource(
            engineCache[this.__engineTag].getDevice(),
            imgBitmap
        );
    }

    /**
     * ????????????
     */
    drawFrame(options: DrawFrameOptions) {
        this.getInstance().drawFrame(options);
    }
}
