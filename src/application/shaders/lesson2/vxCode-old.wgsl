struct Output {
    [[location(0)]] bgColor: vec4<f32>;
    [[builtin(position)]] Position: vec4<f32>;
};

[[stage(vertex)]]
fn main(
    [[location(0)]] aVertexPosition: vec3<f32>,
    [[location(1)]] aVertexBgColor: vec3<f32>
) -> Output {
    var output: Output;
    ouput.Position = vec4<f32>(aVertexPosition, 1.0);
    ouput.bgColor = vec4<f32>(aVertexBgColor, 1.0);

    return output;
}

struct Output {
    [[location(0)]] bgColor: vec4<f32>;
    [[builtin(position)]] Position: vec4<f32>;
};

[[stage(vertex)]]
fn main([[builtin(vertex_index)]] vertexIndex: u32) -> Output {
    var pos = array<vec2<f32>, 3>(
        vec2<f32>(0.0, 0.5),
        vec2<f32>(-0.5, -0.5),
        vec2<f32>(0.5, -0.5)
    );

    var color = array<vec3<f32>, 3>(
        vec3<f32>(1.0, 0.0, 0.0),
        vec3<f32>(0.0, 1.0, 0.0),
        vec3<f32>(0.0, 0.0, 1.0)
    );

    var output: Output;
    ouput.Position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    ouput.bgColor = vec4<f32>(color[vertexIndex], 1.0);

    return output;
}