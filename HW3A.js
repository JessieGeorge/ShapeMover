"use strict";

var gl;
var program;
var vao; // vertex array obj

var bowTie;
// origin vertices for bow tie shape
var orgVerts = [
    -0.2, -0.2,
    -0.2, 0.2,
    0,  0,

    -0.1, -0.1,
    -0.1, 0.1,
    0.1, 0.1,
    -0.1, -0.1,
    0.1, -0.1,
    0.1, 0.1,

    0,  0,
    0.2, -0.2,
    0.2, 0.2
];

/*
// one color per vertex
const colors = new Float32Array([
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,

    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0
]);*/

const colors = new Float32Array([
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0
]);

var aPositionLoc;
var aColorLoc;

var uTranslationLoc;
var translation = [0, 0, 0, 0];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    bowTie = new Float32Array(orgVerts);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    /* color trial:
    var red = [1.0, 0.0, 0.0, 1.0];
    var green = [0.0, 1.0, 0.0, 1.0];
    var blue = [0.0, 0.0, 1.0, 1.0];
    var colors = new Float32Array([green, green, green, red, red, red, red, red, red, blue, blue, blue]); */

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Create a vertex array object (attribute state)
    vao = gl.createVertexArray();
    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    aPositionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer( aPositionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( aPositionLoc );

    aColorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColorLoc);

    uTranslationLoc = gl.getUniformLocation(program, "uTranslation");

    render();
};

function render() {
    gl.useProgram( program );

    //alert("translation = " + translation); // REMOVETHIS
    gl.uniform4fv(uTranslationLoc, translation);

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bufferData( gl.ARRAY_BUFFER, bowTie, gl.STATIC_DRAW );
    gl.drawArrays( gl.TRIANGLES, 0, 12);
}

document.addEventListener('keydown', keyDownHandler, false);

function keyDownHandler(event) {

    var keyCode = event.keyCode;

    var moveAmount = 0.5;

    // clipping box size - start position of corner of bowtie
    var moveLimit = 1 - 0.2;

    if (keyCode == 49) {
        // Press 1 = Return to origin
        // alert("Pressed 1");
        translation = [0, 0, 0, 0];
    }

    if (keyCode == 65) {
        // A = Left
        // alert("A");
        // don't go out of the clipping box
        translation[0] = Math.max(translation[0] - moveAmount,
            -moveLimit);
    } else if (keyCode == 68) {
        // D = Right
        // alert("D");
        translation[0] = Math.min(translation[0] + moveAmount,
            moveLimit);
    }

    if (keyCode == 87) {
        // W = Up
        // alert("W");
        translation[1] = Math.min(translation[1] + moveAmount,
            moveLimit);
    } else if (keyCode == 83) {
        // S = Down
        // alert("S");
        translation[1] = Math.max(translation[1] - moveAmount,
            -moveLimit);
    }

    render();
}