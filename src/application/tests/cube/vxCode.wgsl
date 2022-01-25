struct Uniforms {
    mvpMatrix : mat4x4<f32>;
};

struct Output {
    [[builtin(position)]] Position : vec4<f32>;
    [[location(0)]] vColor : vec4<f32>;
};

struct Input {
    [[location(0)]] pos: vec4<f32>;
    [[location(1)]] color: vec4<f32>;
};

[[binding(0), group(0)]]
var<uniform> uniforms : Uniforms;

[[stage(vertex)]]
fn main(input: Input) -> Output {
    var output: Output;
    output.Position = uniforms.mvpMatrix * input.pos;
    output.vColor = input.color;

    return output;
}
