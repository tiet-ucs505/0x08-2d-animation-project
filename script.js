const canvas = document.getElementById('myCanvas');
const gl = canvas.getContext('webgl');

const speedRange = document.getElementById('speedRange').value;
console.log(speedRange);
var finalSpeed = 0;
var finalSpeed = speedRange*0.004;
var finalOpacity = speedRange*0.014 + 0.3;
function changeSpeed() {
    const speedRange = document.getElementById('speedRange').value;
    console.log(speedRange);
    finalSpeed = speedRange*0.0003;
    finalOpacity = speedRange*0.009 + 0.2;
}


if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
}

// Vertex shader program
const vsSource = `
    attribute vec2 a_position;
    uniform float u_rotation;

    void main() {
        // Rotation matrix
        mat2 rotationMatrix = mat2(cos(u_rotation), -sin(u_rotation), sin(u_rotation), cos(u_rotation));

        gl_Position = vec4(rotationMatrix * a_position, 0.0, 1.0);
    }
`;

// Fragment shader program
const fsSource = `
    precision mediump float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
`;


// Create shader program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

// Get attribute and uniform locations
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
const rotationUniformLocation = gl.getUniformLocation(shaderProgram, 'u_rotation');

// Create buffer
const positionBuffer = gl.createBuffer();

// Define blade positions
const blade1 = [
    0, 0,
    0.5, 0.1,
    0.5, -0.1
];
const blade2 = [
    0, 0,
    0.1, 0.5,
    -0.1, 0.5
];
const blade3 = [
    0, 0,
    -0.5, 0.1,
    -0.5, -0.1
];
const blade4 = [
    0.0, 0,
    -0.1,-0.5,
    0.1,-0.5
];
const allBlades = [...blade1, ...blade2, ...blade3,...blade4];

// Define circle vertices
const circleVertices = [];
const numSegments = 100;
const angleIncrement = (2 * Math.PI) / numSegments;

for (let i = 0; i < numSegments; i++) {
    const angle = angleIncrement * i;
    const x = Math.cos(angle) * 0.09; // Radius of 0.05 for a smaller circle
    const y = Math.sin(angle) * 0.08;
    circleVertices.push(x, y);
}

// Draw function
function draw() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw blades
    gl.useProgram(shaderProgram);

    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allBlades), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // RGBA: red, green, blue, alpha

// Clear the color buffer with the specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Set color for the blades
    gl.uniform4fv(colorUniformLocation, [1.0, 0.0, 0.0, finalOpacity]);

    // Calculate rotation angle (in radians)
    const rotationAngle = performance.now() * finalSpeed; // Rotate at 1 radian per second

    // Pass rotation angle to the shader
    gl.uniform1f(rotationUniformLocation, rotationAngle);

    // Draw blades
    gl.drawArrays(gl.TRIANGLES, 0, allBlades.length / 2);

    // Draw circle
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices), gl.STATIC_DRAW);
    gl.uniform4fv(colorUniformLocation, [1.0,0.0,.00, 0.8]); // Darker color for the circle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVertices.length / 2);

    // Request next frame
    requestAnimationFrame(draw);
}

// Start the animation loop
requestAnimationFrame(draw);

// Create shader function
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Create program function
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error('Program linking failed:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}