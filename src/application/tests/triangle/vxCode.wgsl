struct Output {
    [[builtin(position)]] Position : vec4<f32>;
    [[location(0)]] bgColor : vec4<f32>;
};

[[stage(vertex)]]
fn main(
    [[location(0)]] vPosition: vec3<f32>,
    [[location(1)]] vColor: vec4<f32>
) -> Output {
    var output: Output;
    output.Position = vec4<f32>(vPosition, 1.0);
    output.bgColor = vec4<f32>(vColor);
    return output;
}