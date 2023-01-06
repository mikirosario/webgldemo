var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Rotation__rotAxis, _Rotation__rotVel, _Cube__gl, _Cube__canvas, _Cube__matWorldMatrix, _Cube_createCubeBuffer, _Cube_createCubeAtrributePointers, _Cube_setVertexAttribPointers, _Cube_enableVertexAttribArrays, _Cube_createCubeUniformPointers, _Cube_initializeVertexUniformMatrices, _Cube__draw;
// // Red Triangle
// var vertexShaderText =
// [
// 'precision mediump float;',
// '',
// 'attribute vec2 vertPosition;',
// '',
// 'void main()',
// '{',
// '	gl_Position = vec4(vertPosition, 0.0, 1.0);',
// '}'
// ].join('\n');
//import { glMatrix } from '../../gl-matrix_3-4-0.js';
// var fragmentShaderText =
// [
// 'precision mediump float;',
// '',
// 'void main()',
// '{',					// //R    G    B    A
// '	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
// '}'
// ].join('\n');
//uniform is global var that does not change per vertex, but is still an input
//
// Matrix Multiplication Notes
//matrix multiplication is not commutative; order of operations matters
//relation of order of operations to syntax depends if row-major or column-major
//in OpenGL, which is column-major, ** the right-most operation is done first!! **
//1 2		5 6		1*5+2*7 1*6+2*8		19 22		
//3 4	*	7 8	==	3*5+4*7 3*6+4*8	==	43 50
//		|
//		v
// column-major float arrays
// float[8] cMajorMatA = { 1, 3, 2, 4 };
// float[8] cMajorMatB = { 5, 7, 6, 8 };
// float[8] answer;
// 1 3 2 4 * 5 7 6 8 == 19 43 22 50
// 		==
// answer[0] = cMajorMatA[0] * cMajorMatB[0] + cMajorMatA[2] * cMajorMatB[1];
// answer[1] = cMajorMatA[1] * cMajorMatB[0] + cMajorMatA[3] * cMajorMatB[1];
// answer[2] = cMajorMatA[0] * cMajorMatB[2] + cMajorMatA[2] * cMajorMatB[3];
// answer[3] = cMajorMatA[1] * cMajorMatB[2] + cMajorMatA[3] * cMajorMatB[3];
// answer = CMajorB * CMajorA;
//
//1 2		5 6			9 10
//3 4	*	7 8		*	11 12
//		|
//		v
// column major float arrays
// float[8] cMajorMatA = { 1, 3, 2, 4 };
// float[8] cMajorMatB = { 5, 7, 6, 8 };
// float[8] cMajorMatC = { 9, 10, 11, 12 };
// float[8] answer;
// A * B * C
//	|
//	v
// answer = cMajorMatC * cMajorMatB * cMajorMatA;
let matIdentity = new Float32Array(16);
glMatrix.mat4.identity(matIdentity);
var vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProjection;',
    '',
    'void main()',
    '{',
    '	fragColor = vertColor;',
    '	gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
].join('\n');
var fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '	gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');
class Rotation {
    constructor(rotationAxis, velocity) {
        _Rotation__rotAxis.set(this, new Float32Array([0, 0, 0]));
        _Rotation__rotVel.set(this, 0.0);
        if (Rotation.Axis.hasOwnProperty(rotationAxis) == false)
            throw 'Rotation object instantiation failed: rotationAxis is not an Axis.';
        __classPrivateFieldGet(this, _Rotation__rotAxis, "f")[Rotation.Axis[rotationAxis]] = 1;
        __classPrivateFieldSet(this, _Rotation__rotVel, velocity <= 0.0 ? 0.0 : Math.min(velocity, 1.0), "f");
    }
    get getAxis() {
        return __classPrivateFieldGet(this, _Rotation__rotAxis, "f");
    }
    get getVelocity() {
        return __classPrivateFieldGet(this, _Rotation__rotVel, "f");
    }
}
_Rotation__rotAxis = new WeakMap(), _Rotation__rotVel = new WeakMap();
Rotation.Axis = {
    'X': 0,
    'Y': 1,
    'Z': 2
};
;
//class Triangle {
//	constructor(gl, program)
//	{
//		this.#_gl = gl;
//		if (
//			!this.#createTriangleBuffer() ||
//			!this.#createTriangleAtrributePointers(program) ||
//			!this.#setVertexAttribPointers() ||
//			!this.#enableVertexAttribArrays() ||
//			!this.#createTriangleUniformPointers(program) ||
//			!this.#initializeVertexUniformMatrices() //initialize uniform matrices to identity matrix
//		)
//			throw 'Triangle instantiation failed.'
//	}
//	//Properties
//	#_gl;
//	triangleVertices =
//	[ //x, y, z				R, G, B
//		0.0, 0.5, 0.0,		1.0, 0.0, 0.5,
//		-0.5, -0.5, 0.0,	1.0, 0.0, 1.0,
//		0.5, -0.5, 0.0,		0.0, 0.0, 1.0
//	];
//	triangleVertexBuffer;
//	vertCoordLocation;
//	vertColorLocation;
//	matWorldUniformLocation;
//	matViewUniformLocation;
//	matProjectionUniformLocation;
//	#_matWorldMatrix = new Float32Array(16);
//	matViewValue;
//	matProjectionValue;
//	//Private Methods
//	#createTriangleBuffer = function ()
//	{
//		var retVal = false;
//		if (!(this.triangleVertexBuffer = this.gl.createBuffer()))
//			console.error('createBuffer() failed in createTriangleBuffer() in Triangle.constructor()');
//		else if (this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexBuffer))									//set triangleVertexBuffer as active buffer
//			console.error('bindBuffer() failed in createTriangleBuffer() in Triangle.constructor()');
//		else if (this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.triangleVertices), this.gl.STATIC_DRAW))	//send data to active buffer (buffer type, data cast to 32 bit float, cpu->gpu direct, with no subsequent changes)
//			console.error('bufferData() failed in createTriangleBuffer() in Triangle.constructor()');
//		else
//			retVal = true;
//		return retVal;
//	}
//	#createTriangleAtrributePointers = function (program)
//	{
//		var retVal = false;
//		if ((this.vertCoordLocation = this.gl.getAttribLocation(program, 'vertPosition')) < 0)
//			console.error('getAttribLocation() failed for vertPosition in createTriangleAttributePointers() in Triangle.constructor()');
//		else if
//			((this.vertColorLocation = this.gl.getAttribLocation(program, 'vertColor')) < 0)
//			console.error('getAttribLocation() failed for vertColor in createTriangleAttributePointers() in Triangle.constructor()');
//		else
//			retVal = true;
//		return retVal;
//	}
//	#setVertexAttribPointers = function ()
//	{
//		var retVal;
//		try
//		{
//			this.gl.vertexAttribPointer(
//				this.vertCoordLocation,				//Attrib location in buffer
//				3,									//Number of elements in attribute
//				this.gl.FLOAT,						//Type of each element in attribute
//				false,						//Is data normalized?
//				6 * Float32Array.BYTES_PER_ELEMENT,	//Size of an individual vertex in bytes
//				0									//Offset from the beginning of a single vertex to this attribute
//			);
//			this.gl.vertexAttribPointer(
//				this.vertColorLocation,				//Attrib location in buffer
//				3,									//Number of elements in attribute
//				this.gl.FLOAT,						//Type of each element in attribute
//				false,						//Is data normalized?
//				6 * Float32Array.BYTES_PER_ELEMENT,	//Size of an individual vertex in bytes
//				3 * Float32Array.BYTES_PER_ELEMENT	//Offset from the beginning of a single vertex to this attribute in bytes
//			);
//			retVal = true;
//		}
//		catch (e)
//		{
//			retVal = false;
//			console.error('vertexAttribPointer() failed in setVertexAttribPointers in Triangle.constructor.\n', e);
//		}
//		return retVal;
//	}
//	#enableVertexAttribArrays = function ()
//	{
//		var retVal = false;
//		this.gl.enableVertexAttribArray(this.vertCoordLocation);	//enable attribute for use
//		this.gl.enableVertexAttribArray(this.vertColorLocation);	//enable attribute for use
//		if (this.gl.getError() == this.gl.NO_ERROR)
//			retVal = true;
//		else
//			console.error('vertexAttribArray() failed in enableVertexAttribArrays() in Triangle.constructor');
//		return retVal;
//	}
//	#createTriangleUniformPointers = function (program)
//	{
//		var retVal = false;
//		if ((this.matWorldUniformLocation = this.gl.getUniformLocation(program, 'mWorld')) == null)
//			console.error('getUniformLocation() failed for mWorld in createTriangleAttributePointers() in Triangle.constructor()');
//		else if ((this.matViewUniformLocation = this.gl.getUniformLocation(program, 'mView')) == null)
//			console.error('getUniformLocation() failed for mView in createTriangleAttributePointers() in Triangle.constructor()');
//		else if ((this.matProjectionUniformLocation = this.gl.getUniformLocation(program, 'mProjection')) == null)
//			console.error('getUniformLocation() failed for mProjection in createTriangleAttributePointers() in Triangle.constructor()');
//		else
//			retVal = true;
//		return retVal;
//	}
//	#initializeVertexUniformMatrices = function ()
//	{
//		var retVal = false;
//		this.matViewValue = new Float32Array(16);
//		this.matProjectionValue = new Float32Array(16);
//												//camera position xyz, looking at xyz, up direction xyz (+y is up)
//		this.matViewValue = glMatrix.mat4.lookAt(this.matViewValue, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
//												//vertical fov in radians, aspect ratio (viewport width/height), near bound frustum, far bound frustum
//		this.matProjectionValue = glMatrix.mat4.perspective(this.matProjectionValue, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);
//		this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, matIdentity);
//		//gl.uniformMatrix4fv(this.matViewUniformLocation, gl.FALSE, matIdentity);
//		this.gl.uniformMatrix4fv(this.matViewUniformLocation, false, this.matViewValue);
//		this.gl.uniformMatrix4fv(this.matProjectionUniformLocation, false, this.matProjectionValue);
//		if (this.gl.getError() == this.gl.NO_ERROR)
//			retVal = true;
//		else
//			console.error('uniformMatrix4fv() failed in initializeVertexUniformMatrices() in Triangle.constructor');
//		return retVal;
//	}
//	//Public Methods
//	rotate = function()
//	{
//		//var angle = performance.now() / 1000 / 6 * 2 * Math.PI;			  //x, y, z
//			//ms since window opened / 1000 == seconds since window opened
//			//seconds since window opened / 6 == 1/6 of time since window opened
//			//2 * PI == 1 full rotation 
//			// Every sixth of the time since the window opened, a sixth of a rotation is done?
//		var angle = performance.now() * 0.001 * 0.6 * 2 * Math.PI;			  //x, y, z
//		glMatrix.mat4.rotate(this.#_matWorldMatrix, matIdentity, angle, [0, 1, 0]);
//		this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.#_matWorldMatrix);
//	}
//	//Getters
//	get gl()
//	{
//		return this.#_gl;
//	}
//	get matWorldMatrix()
//	{
//		return this.#_matWorldMatrix;
//	}
//};
class Cube {
    constructor(canvas, gl, program) {
        //Properties
        _Cube__gl.set(this, void 0);
        _Cube__canvas.set(this, void 0);
        this.cubeVertices = new Float32Array(//each face consists of two triangles that share two vertices.
        [
            //top face
            //x, y, z				R, G, B
            -1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
            1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
            1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
            //left face
            //x, y, z				R, G, B
            -1.0, 1.0, 1.0, 0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0, 0.75, 0.25, 0.5,
            -1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
            -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,
            //right face
            //x, y, z				R, G, B
            1.0, 1.0, 1.0, 0.25, 0.25, 0.75,
            1.0, -1.0, 1.0, 0.25, 0.25, 0.75,
            1.0, -1.0, -1.0, 0.25, 0.25, 0.75,
            1.0, 1.0, -1.0, 0.25, 0.25, 0.75,
            //front face
            //x, y, z				R, G, B
            1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
            1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
            -1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
            -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
            //back face
            //x, y, z				R, G, B
            1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
            1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
            -1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
            -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
            //bottom face
            //x, y, z				R, G, B
            -1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
            -1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
            1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
            1.0, -1.0, -1.0, 0.5, 0.5, 1.0
        ]);
        this.cubeIndices = new Uint16Array(//which vertices form a triangle on each face
        [
            //top
            0, 1, 2,
            0, 2, 3,
            //left
            5, 4, 6,
            6, 4, 7,
            //right
            8, 9, 10,
            8, 10, 11,
            //front
            13, 12, 14,
            15, 14, 12,
            //back
            16, 17, 18,
            16, 18, 19,
            //bottom
            21, 20, 22,
            22, 20, 23
        ]);
        this.cubeVertexBuffer = null;
        this.cubeIndexBuffer = null; //order of triangles to draw
        this.vertCoordLocation = -1;
        this.vertColorLocation = -1;
        this.matWorldUniformLocation = null;
        this.matViewUniformLocation = null;
        this.matProjectionUniformLocation = null;
        _Cube__matWorldMatrix.set(this, new Float32Array(16));
        this.matViewValue = new Float32Array(16);
        this.matProjectionValue = new Float32Array(16);
        //#_rotationMatrices = [new Float32Array(16), new Float32Array(16), new Float32Array(16)];
        //Private Methods
        _Cube_createCubeBuffer.set(this, function () {
            let retVal = false;
            if (!(this.cubeVertexBuffer = this.gl.createBuffer()))
                console.error('createBuffer() failed to create cubeVertexBuffer in createCubeBuffer() in Cube.constructor()');
            else if (!(function () { this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexBuffer); return this.gl.getError() === this.gl.NO_ERROR ? true : false; }).bind(this)()) //set cubeVertexBuffer as active buffer
                console.error('bindBuffer() failed to bind cubeVertexBuffer in createCubeBuffer() in Cube.constructor()');
            else if (!(function () { this.gl.bufferData(this.gl.ARRAY_BUFFER, this.cubeVertices, this.gl.STATIC_DRAW); return this.gl.getError() === this.gl.NO_ERROR ? true : false; }).bind(this)()) //send data to active buffer (buffer type, data cast to 32 bit float, cpu->gpu direct, with no subsequent changes)
                console.error('bufferData() failed to assign cubeVertices in createCubeBuffer() in Cube.constructor()');
            else if (!(this.cubeIndexBuffer = this.gl.createBuffer()))
                console.error('createBuffer() failed to create cubeIndexBuffer in createCubeBuffer() in Cube.constructor()');
            else if (!(function () { this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeIndexBuffer); return this.gl.getError() === this.gl.NO_ERROR ? true : false; }).bind(this)())
                console.error('bindBuffer() failed to bind cubeIndexBuffer in createCubeBuffer() in Cube.constructor()');
            else if (!(function () { this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeIndices, this.gl.STATIC_DRAW); return this.gl.getError() === this.gl.NO_ERROR ? true : false; }).bind(this)()) //send data to active buffer (buffer type, data cast to 32 bit float, cpu->gpu direct, with no subsequent changes)
                console.error('bufferData() failed to assign cubeIndices in createCubeBuffer() in Cube.constructor()');
            else
                retVal = true;
            return retVal;
        });
        _Cube_createCubeAtrributePointers.set(this, function (program) {
            let retVal = false;
            if ((this.vertCoordLocation = this.gl.getAttribLocation(program, 'vertPosition')) < 0)
                console.error('getAttribLocation() failed for vertPosition in createCubeAttributePointers() in Cube.constructor()');
            else if ((this.vertColorLocation = this.gl.getAttribLocation(program, 'vertColor')) < 0)
                console.error('getAttribLocation() failed for vertColor in createCubeAttributePointers() in Cube.constructor()');
            else
                retVal = true;
            return retVal;
        });
        _Cube_setVertexAttribPointers.set(this, function () {
            let retVal;
            try {
                this.gl.vertexAttribPointer(this.vertCoordLocation, //Attrib location in buffer
                3, //Number of elements in attribute
                this.gl.FLOAT, //Type of each element in attribute
                false, //Is data normalized?
                6 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex in bytes
                0 //Offset from the beginning of a single vertex to this attribute
                );
                this.gl.vertexAttribPointer(this.vertColorLocation, //Attrib location in buffer
                3, //Number of elements in attribute
                this.gl.FLOAT, //Type of each element in attribute
                false, //Is data normalized?
                6 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex in bytes
                3 * Float32Array.BYTES_PER_ELEMENT //Offset from the beginning of a single vertex to this attribute in bytes
                );
                retVal = true;
            }
            catch (e) {
                retVal = false;
                console.error('vertexAttribPointer() failed in setVertexAttribPointers in Cube.constructor.\n', e);
            }
            return retVal;
        });
        _Cube_enableVertexAttribArrays.set(this, function () {
            let retVal = false;
            this.gl.enableVertexAttribArray(this.vertCoordLocation); //enable attribute for use
            this.gl.enableVertexAttribArray(this.vertColorLocation); //enable attribute for use
            if (this.gl.getError() == this.gl.NO_ERROR)
                retVal = true;
            else
                console.error('vertexAttribArray() failed in enableVertexAttribArrays() in Cube.constructor');
            return retVal;
        });
        _Cube_createCubeUniformPointers.set(this, function (program) {
            let retVal = false;
            if ((this.matWorldUniformLocation = this.gl.getUniformLocation(program, 'mWorld')) == null)
                console.error('getUniformLocation() failed for mWorld in createCubeAttributePointers() in Cube.constructor()');
            else if ((this.matViewUniformLocation = this.gl.getUniformLocation(program, 'mView')) == null)
                console.error('getUniformLocation() failed for mView in createCubeAttributePointers() in Cube.constructor()');
            else if ((this.matProjectionUniformLocation = this.gl.getUniformLocation(program, 'mProjection')) == null)
                console.error('getUniformLocation() failed for mProjection in createCubeAttributePointers() in Cube.constructor()');
            else
                retVal = true;
            return retVal;
        });
        _Cube_initializeVertexUniformMatrices.set(this, function () {
            let retVal = false;
            //this.matViewValue = new Float32Array(16);
            //this.matProjectionValue = new Float32Array(16);
            //camera position xyz, looking at xyz, up direction xyz (+y is up)
            this.matViewValue = glMatrix.mat4.lookAt(this.matViewValue, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
            //vertical fov in radians, aspect ratio (viewport width/height), near bound frustum, far bound frustum
            this.matProjectionValue = glMatrix.mat4.perspective(this.matProjectionValue, glMatrix.glMatrix.toRadian(45), __classPrivateFieldGet(this, _Cube__canvas, "f").width / __classPrivateFieldGet(this, _Cube__canvas, "f").height, 0.1, 1000.0);
            this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, matIdentity);
            //gl.uniformMatrix4fv(this.matViewUniformLocation, gl.FALSE, matIdentity);
            this.gl.uniformMatrix4fv(this.matViewUniformLocation, false, this.matViewValue);
            this.gl.uniformMatrix4fv(this.matProjectionUniformLocation, false, this.matProjectionValue);
            if (this.gl.getError() == this.gl.NO_ERROR)
                retVal = true;
            else
                console.error('uniformMatrix4fv() failed in initializeVertexUniformMatrices() in Cube.constructor');
            return retVal;
        });
        _Cube__draw.set(this, function () {
            this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, __classPrivateFieldGet(this, _Cube__matWorldMatrix, "f"));
            setBckrnd(this.gl);
            this.gl.drawElements(this.gl.TRIANGLES, this.cubeIndices.length, this.gl.UNSIGNED_SHORT, 0);
        }
        //Public Methods
        );
        //Public Methods
        this.rotate = function (...rotations) {
            //var angle = performance.now() / 1000 / 6 * 2 * Math.PI;			  //x, y, z
            //ms since window opened / 1000 == seconds since window opened
            //seconds since window opened / 6 == 1/6 of time since window opened
            //2 * PI == 1 full rotation 
            // Every sixth of the time since the window opened, a sixth of a rotation is done?
            var rotAngle = performance.now() * 0.001 * 0.1 * 2 * Math.PI; //x, y, z
            var rotationMatrices = [new Float32Array(matIdentity), new Float32Array(matIdentity), new Float32Array(matIdentity)];
            for (let i = 0; i < rotations.length; ++i)
                glMatrix.mat4.rotate(rotationMatrices[i], matIdentity, rotAngle * rotations[i].getVelocity, rotations[i].getAxis);
            glMatrix.mat4.mul(__classPrivateFieldGet(this, _Cube__matWorldMatrix, "f"), rotationMatrices[1], rotationMatrices[0]);
            glMatrix.mat4.mul(__classPrivateFieldGet(this, _Cube__matWorldMatrix, "f"), rotationMatrices[2], __classPrivateFieldGet(this, _Cube__matWorldMatrix, "f"));
            __classPrivateFieldGet(this, _Cube__draw, "f").call(this);
            requestAnimationFrame(() => this.rotate(...rotations.slice(0))); //ChatGPT taught me how to wrap this call in an anon function, so I can pass it with its argument :D
        };
        this.Animation = {
            ROTATE_Y: this.rotate.bind(this) //Rotate along the Y axis
        };
        __classPrivateFieldSet(this, _Cube__gl, gl, "f");
        __classPrivateFieldSet(this, _Cube__canvas, canvas, "f");
        if (!__classPrivateFieldGet(this, _Cube_createCubeBuffer, "f").call(this) ||
            !__classPrivateFieldGet(this, _Cube_createCubeAtrributePointers, "f").call(this, program) ||
            !__classPrivateFieldGet(this, _Cube_setVertexAttribPointers, "f").call(this) ||
            !__classPrivateFieldGet(this, _Cube_enableVertexAttribArrays, "f").call(this) ||
            !__classPrivateFieldGet(this, _Cube_createCubeUniformPointers, "f").call(this, program) ||
            !__classPrivateFieldGet(this, _Cube_initializeVertexUniformMatrices, "f").call(this) //initialize uniform matrices to identity matrix
        )
            throw 'Cube instantiation failed.';
    }
    //Getters
    get gl() {
        return __classPrivateFieldGet(this, _Cube__gl, "f");
    }
    get matWorldMatrix() {
        return __classPrivateFieldGet(this, _Cube__matWorldMatrix, "f");
    }
}
_Cube__gl = new WeakMap(), _Cube__canvas = new WeakMap(), _Cube__matWorldMatrix = new WeakMap(), _Cube_createCubeBuffer = new WeakMap(), _Cube_createCubeAtrributePointers = new WeakMap(), _Cube_setVertexAttribPointers = new WeakMap(), _Cube_enableVertexAttribArrays = new WeakMap(), _Cube_createCubeUniformPointers = new WeakMap(), _Cube_initializeVertexUniformMatrices = new WeakMap(), _Cube__draw = new WeakMap();
;
function setBckrnd(gl) {
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
function getHTMLCanvasElement() {
    let canvas = document.getElementById('draw_canvas');
    if (!canvas)
        throw 'document.getElementById() failed in getHTMLCanvasElement()';
    return canvas;
}
function getWebGLContext(canvas) {
    let gl = canvas.getContext('webgl');
    if (!gl) {
        alert('Your browser does not support WebGL');
        throw 'canvas.getContext() failed in getWebGLContext()';
    }
    return gl;
}
function compileRenderProg(gl) {
    let program = null;
    let vertexShader;
    let fragmentShader;
    if (!(vertexShader = gl.createShader(gl.VERTEX_SHADER))) //Create vertex shader object (returns null on error)
        console.error('createShader() failed to create VERTEX_SHADER object in compileRenderProg()');
    else if (!(fragmentShader = gl.createShader(gl.FRAGMENT_SHADER))) //Create fragment shader object (returns null on error)
        console.error('createShader() failed to create FRAGMENT_SHADER object in compileRenderProg()');
    else if (!(function () { gl.shaderSource(vertexShader, vertexShaderText); return gl.getError() == gl.NO_ERROR ? true : false; })()) //Try to pass vertexShaderText to vertexShader
        console.error('shaderSource() failed to get vertexShaderText in compileRenderProg()');
    else if (!(function () { gl.shaderSource(fragmentShader, fragmentShaderText); return gl.getError() == gl.NO_ERROR ? true : false; })()) //Try to pass vertexShaderText to vertexShader
        console.error('shaderSource() failed to get fragmentShaderText in compileRenderProg()');
    else if (!(function () { gl.compileShader(vertexShader); return gl.getError() == gl.NO_ERROR ? true : false; })()) //Try to compile vertex shader
        console.error('compileShader() failed to compile vertexShader in compileRenderProg()');
    else if (!(function () { gl.compileShader(fragmentShader); return gl.getError() == gl.NO_ERROR ? true : false; })()) //Try to compile fragment shader
        console.error('compileShader() failed to compile fragmentShader in compileRenderProg()');
    else if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) //Check vertex shader compile status (returns 0 on error)
        console.error('Vertex Shader compile error in compileRenderProg()', gl.getShaderInfoLog(vertexShader));
    else if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) //Check fragment shader compile status (returns 0 on error)
        console.error('Fragment Shader compile error in compileRenderProg()', gl.getShaderInfoLog(fragmentShader));
    else if (!(program = gl.createProgram())) //Create program object (= shader pipeline) (returns null on error)
        console.error('createProgram() failed in compileRenderProg()');
    else if (!(function () { gl.attachShader(program, vertexShader); return gl.getError() == gl.NO_ERROR ? true : false; })()) //Attach vertex shader to program object
        console.error('attachShader() failed to attach the vertexShader in compileRenderProg()');
    else if (!(function () { gl.attachShader(program, fragmentShader); return gl.getError() == gl.NO_ERROR ? true : false; })()) //Attach fragment shader to program object
        console.error('attachShader() failed to attach the fragmentShader in compileRenderProg()');
    else if (!(function () { gl.linkProgram(program); return gl.getError() == gl.NO_ERROR ? true : false; })()) //Try to link program
        console.error('linkProgram() failed in compileRenderProg()');
    else if (!gl.getProgramParameter(program, gl.LINK_STATUS)) //Check link status after link attempt
        console.error('Bad Link Status after linkProgram() call in compileRenderProg()', gl.getProgramInfoLog(program));
    else
        return program;
    throw 'compileRenderProg failed()';
}
var InitDemo = function () {
    const canvas = getHTMLCanvasElement();
    const gl = getWebGLContext(canvas);
    let program = compileRenderProg(gl);
    //dynamic adjustments:
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    console.log('This is working');
    //DEBUG ONLY
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program', gl.getProgramInfoLog(program));
        return;
    }
    //DEBUG ONLY
    gl.useProgram(program); //Set active program in OpenGL state machine
    //var triangle = new Triangle(gl, program);
    let cube = new Cube(canvas, gl, program);
    setBckrnd(gl);
    //Main render loop
    //requestAnimationFrame uses 'tail recursion'.
    //Calling itself is the last thing it does before returning, so it does not overflow the stack.
    gl.enable(gl.DEPTH_TEST); //if pixel drawn on frame buffer already, only draw new pixel if it is closer to virtual camera
    gl.enable(gl.CULL_FACE); //don't do math for culled faces
    gl.frontFace(gl.CCW); //A face is formed by the order of the vertices appearing counter-clockwise to each other
    gl.cullFace(gl.BACK); //Cull the faces at the back
    cube.rotate(new Rotation('X', 0.25), new Rotation('Y', 1), new Rotation('Z', 0.75));
};
