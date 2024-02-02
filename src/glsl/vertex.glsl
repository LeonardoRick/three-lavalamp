uniform __import__snoise; // this line will be replaced by replaceShaderImport function


uniform float uTime;
uniform vec3 uPallete[5]; // five colors 0-4 indexes
uniform float uIntensity[5]; // five intensities 0-4 indexes
uniform float uImportance[5]; // five importances 0-4 indexes

uniform float uInclineXY;
uniform float uInclineX;
uniform float uInclineOffset;
uniform float uBendOnX;

uniform float uNoiseHeight;
uniform float uNoiseX;
uniform float uNoiseY;
uniform float uNoiseSpeed;
uniform float uNoiseFloor;

uniform int uMainColor;
uniform float uColorSeed;
uniform float uColorDirectionX;
uniform float uColorSpeed;
uniform float uColorFreq;
uniform float uColorFreqY;

uniform float uColorNoiseFloor;
uniform float uColorNoiseCeil;

varying vec2 vUv;
varying vec3 vColor;

float PI = 3.141592653589793238;

void main() {
    vUv = uv;

    /**
    * position
    */
    vec2 noiseXY = uv * vec2(uNoiseX, uNoiseY);
    float inclineY = uv.y * uInclineXY;
    float inclineX = uv.x * uInclineX;

    float bendOnX = uBendOnX * uv.y * uv.y;
    // twist the shape little bit
    float offset = inclineX * mix(-uInclineOffset, uInclineOffset, uv.y);

    // doesn't make sense to tweak this offsets (3. and 10.), just make sure to keep them
    // different from each other to pursue randomness
    float noise = snoise(vec3(noiseXY.x + uTime * 3., noiseXY.y, uTime * uNoiseSpeed));

    // only wave to the top, since it's a plane
    noise = max( uNoiseFloor, noise);

    vec3 pos = vec3(position.x, position.y, position.z + noise * uNoiseHeight + inclineY + inclineX + offset + bendOnX);

    /**
    * color
    */
    vColor = uPallete[uMainColor] * uIntensity[uMainColor];


    float mainImportance = uImportance[uMainColor];

    for (int i = 0; i < 5; i++) {
        if (i != uMainColor) {
            // snoise function seems to not be pure so getting a new instance for each
            // interaction will generate a better random behavior, what we want. But this
            // random value is only ranmdomizing the color, not changing the position
            // where the color is, and thats what colorFlow tries to do
            float fi = float(i);
            float colorSeed = 1. + fi * uColorSeed;
            float colorFlow = 5. + fi * -uColorDirectionX;
            float colorSpeed = 10. + fi * uColorSpeed;

            // play with this value to show more randomness on the colors (more messy)
            vec2 colorFreq = vec2(uColorFreq, uColorFreq + uColorFreqY);

            float noiseFloor = uColorNoiseFloor;
            float noiseCeil = uColorNoiseCeil + fi * 0.07;

            float importance = uImportance[i] / mainImportance;

            float colorNoise = snoise(
                vec3(
                    noiseXY.x * colorFreq.x + uTime * colorFlow,
                    noiseXY.y * colorFreq.y,
                    uTime * colorSpeed + colorSeed
                )
            );

            colorNoise = mix(colorNoise, 1., importance - 1.);
            float smoothColorNoise = smoothstep(noiseFloor, noiseCeil, colorNoise);



            vColor = mix(vColor, uPallete[i] * uIntensity[i], smoothColorNoise);

        }
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}