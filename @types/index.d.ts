type UniqueKey = string | symbol;

interface UniqueData {
    key: UniqueKey;
}

type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

interface ActionRecord {
    status: boolean;
    ret: number;
}
