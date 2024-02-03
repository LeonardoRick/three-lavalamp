// this __import__ lines will be replaced by replaceShaderImport function
uniform __import__shared;
uniform __import__cnoise;
uniform __import__snoise;

varying vec2 vUv;
varying vec3 vColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePosition;

uniform float uMouseIntensity;
uniform float uMouseRadius;

uniform float uGrain;
uniform float uGrainSpeed;

uniform float uPerlinNoise;

float grain(vec2 seed, float time, float timeMultiplier)
{
    float x = (seed.x / 3.14159 + 4.) * (seed.y / 13. + 4.) * ((fract(time) * timeMultiplier + 1.) * 10.);
    return mod((mod(x, 13.) + 1.) * (mod(x, 123.) + 1.), 0.01) - 0.005;
}

void main() {
	vec3 color = vColor;

	// apply grain effect
	vec3 grainEffect = vec3(grain(gl_FragCoord.xy, uTime, uGrainSpeed));
	color += grainEffect * uGrain;

	// apply perlin noise
	color += cnoise(color) * uPerlinNoise;

    // Convert gl_FragCoord from pixels to the same [0, 1] range for accurate distance calculation
    vec2 fragCoordNormalized = gl_FragCoord.xy / uResolution;
	// Calculate the distance in the [0, 1] range
    float dist = distance(fragCoordNormalized, uMousePosition);
 	// Modify this line to adjust the influence of the mouse position over the noise.
    // For example, you could make the noise effect stronger as the fragment is closer to the mouse position
    float mouseInfluence = 1.0 - smoothstep(0.0, uMouseRadius, dist); // Adjust the 0.5 value as needed
	// Calculate the noise based on the fragment's position
    // float noise = snoise(vec3(vUv * uResolution, uTime));
	// Mix the noise effect with the base color based on the mouse influence
    color += vec3(mouseInfluence * uMouseIntensity);

	gl_FragColor = vec4(color, 1);
}