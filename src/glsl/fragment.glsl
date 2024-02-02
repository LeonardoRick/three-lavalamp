// this __import__ lines will be replaced by replaceShaderImport function
uniform __import__shared;
uniform __import__cnoise;

varying vec2 vUv;
varying vec3 vColor;

uniform float uTime;
uniform float uGrain;
uniform float uGrainSpeed;

uniform float uPerlinNoise;

float grain(vec2 seed, float time, float timeMultiplier)
{
    float x = (seed.x / 3.14159 + 4.) * (seed.y / 13. + 4.) * ((fract(time) * timeMultiplier + 1.) * 10.);
    return mod((mod(x, 13.) + 1.) * (mod(x, 123.) + 1.), 0.01) - 0.005;
}

void main() {
	vec3 grainEffect = vec3(grain(gl_FragCoord.xy, uTime, uGrainSpeed));
	gl_FragColor = vec4(vColor, 1);
	gl_FragColor.rgb += grainEffect * uGrain;
	gl_FragColor.rgb += cnoise(gl_FragColor.rgb) * uPerlinNoise;
}