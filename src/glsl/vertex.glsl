uniform __import__snoise; // this line will be replaced by replaceShaderImport function


uniform float uTime;
uniform vec3 uPallete[5];

uniform float uInclineXY;
uniform float uInclineX;
uniform float uInclineOffset;
uniform float uBendOnX;

uniform float uNoise;

uniform float uColorSeed;
uniform float uColorFlow;
uniform float uColorSpeed;
uniform float uColorFreq;
uniform float uColorFreqY;

uniform float uNoiseFloor;
uniform float uNoiseCeil;

varying vec2 vUv;
varying vec3 vColor;

float PI = 3.141592653589793238;

void main() {
    vUv = uv;

    /**
    * noise
    */
    vec2 noiseXY = uv * vec2(3., 4.);
    float inclineY = uv.y * uInclineXY;
    float inclineX = uv.x * uInclineX;

    float bendOnX = uBendOnX * uv.y * uv.y;
    // twist the shape little bit
    float offset = inclineX * mix(-uInclineOffset, uInclineOffset, uv.y);

    // doesn't make sense to tweak this offsets (3. and 10.), just make sure to keep them
    // different from each other to pursue randomness
    float noise = snoise(vec3(noiseXY.x + uTime * 3., noiseXY.y, uTime * 10.));
    // only wave to the top, since it's a plane
    noise = max( 0., noise);
    vec3 pos = vec3(position.x, position.y, position.z + noise * uNoise + inclineY + inclineX + offset + bendOnX);

    /**
    * color
    */
    vColor = uPallete[4];
    for (float i = 0.; i < 4.; i++) {

        // snoise function seems to not be pure so getting a new instance for each
        // interaction will generate a better random behavior, what we want. But this
        // random value is only ranmdomizing the color, not changing the position
        // where the color is, and thats what colorFlow tries to do
        float colorSeed = 1. + i * uColorSeed;
        float colorFlow = 5. + i * -uColorFlow;
        float colorSpeed = 10. + i * uColorSpeed;

        // play with this value to show more randomness on the colors (more messy)
        vec2 colorFreq = vec2(uColorFreq, uColorFreq + uColorFreqY);

        float noiseFloor = uNoiseFloor;
        float noiseCeil = uNoiseCeil + i * 0.07;

        float colorNoise = smoothstep(noiseFloor, noiseCeil, snoise(
            vec3(
                noiseXY.x * colorFreq.x + uTime * colorFlow,
                noiseXY.y * colorFreq.y,
                uTime * colorSpeed + colorSeed
            )
        ));

        vColor = mix(vColor, uPallete[int(i)], colorNoise);
    }


    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}