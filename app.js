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

// var fragmentShaderText =
// [
// 'precision mediump float;',
// '',
// 'void main()',
// '{',					// //R    G    B    A
// '	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
// '}'
// ].join('\n');

var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'	fragColor = vertColor;',
'	gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',				//   RGB		A
'	gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

setBckrnd = function(gl)
{
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

var getHTMLCanvasElement = function()
{
	var canvas = document.getElementById('draw_canvas');
	if (!canvas)
		console.error('getElementById() failed in getHTMLCanvasElement()');
	return canvas;
}

var getWebGLContext = function(canvas)
{
	var gl = canvas.getContext('webgl');
	if (!gl)
		alert('Your browser does not support WebGL');
	return gl;
}

var compileRenderProg = function(gl)
{
	var retVal = null;
	var vertexShader;
	var fragmentShader;
	var program;

	if (!(vertexShader = gl.createShader(gl.VERTEX_SHADER)))			//Create vertex shader object (returns null on error)
		console.error('createShader() failed to create VERTEX_SHADER object in compileRenderProg()');
	else if (!(fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)))	//Create fragment shader object (returns null on error)
		console.error('createShader() failed to create FRAGMENT_SHADER object in compileRenderProg()');
	else if (gl.shaderSource(vertexShader, vertexShaderText))			//Send vertex shader source code to vertex shader object (returns error code on error)
		console.error('shaderSource() failed to get vertexShaderText in compileRenderProg()');
	else if (gl.shaderSource(fragmentShader, fragmentShaderText))		//Send fragment shader source code to fragment shader object (returns error code on error)
		console.error('shaderSource() failed to get fragmentShaderText in compileRenderProg()');
	else if (gl.compileShader(vertexShader))							//Try to compile vertex shader (returns error code on error)
		console.error('compileShader() failed to compile vertexShader in compileRenderProg()');
	else if (gl.compileShader(fragmentShader))							//Try to compile fragment shader (returns error code on error)
		console.error('compileShader() failed to compile fragmentShader in compileRenderProg()');
	else if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))	//Check vertex shader compile status (returns 0 on error)
		console.error('Vertex Shader compile error in compileRenderProg()', gl.getShaderInfoLog(vertexShader));
	else if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))	//Check fragment shader compile status (returns 0 on error)
		console.error('Fragment Shader compile error in compileRenderProg()', gl.getShaderInfoLog(fragmentShader));
	else if (!(program = gl.createProgram()))							//Create program object (= shader pipeline) (returns null on error)
		console.error('createProgram() failed in compileRenderProg()');
	else if (gl.attachShader(program, vertexShader))					//Attach vertex shader to program object  (returns error code on error)
		console.error('attachShader() failed to attach the vertexShader in compileRenderProg()');
	else if (gl.attachShader(program, fragmentShader))					//Attach fragment shader to program object (returns error code on error)
		console.error('attachShader() failed to attach the fragmentShader in compileRenderProg()');
	else if (gl.linkProgram(program))									//Try to link program
		console.error('linkProgram() failed in compileRenderProg()');
	else if (!gl.getProgramParameter(program, gl.LINK_STATUS))			//Check link status after link attempt
		console.error('Bad Link Status after linkProgram() call in compileRenderProg()', gl.getProgramInfoLog(program));
	else
		retVal = program;
	return retVal;
}

var createTriangleBuffer = function (gl)
{
	var retVal = null;
	var triangleVertices =
	[ //x, y			R, G, B
		0.0, 0.5,		1.0, 0.0, 0.5,
		-0.5, -0.5,		1.0, 0.0, 1.0,
		0.5, -0.5,		0.0, 0.0, 1.0
	];
	var triangleVertexBuffer;

	if (!(triangleVertexBuffer = gl.createBuffer()))
		console.error('createBuffer() failed in createTriangleBuffer()');
	else if (gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer))									//set triangleVertexBuffer as active buffer
		console.error('bindBuffer() failed in createTriangleBuffer()');
	else if (gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW))	//send data to active buffer (buffer type, data cast to 32 bit float, cpu->gpu direct, with no subsequent changes)
		console.error('bufferData() failed in creatingTriangleBuffer');
	else
		retVal = triangleVertexBuffer;
	return retVal;
}

var InitDemo = function ()
{
	console.log('This is working');
	var canvas;
	var gl;
	var program;

	//dynamic adjustments:
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	// gl.viewport(0, 0, window.innerWidth, window.innerHeight);

	if (!(canvas = getHTMLCanvasElement()) || !(gl = getWebGLContext(canvas)) || !(program = compileRenderProg(gl)))
		return;

	//DEBUG ONLY
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error('Error validating program', gl.getProgramInfoLog(program));
		return;
	}
	//DEBUG ONLY

	var triangleVertexBuffer;
	if (!(triangleVertexBuffer = createTriangleBuffer(gl)))
		return ;


	// var triangleVertexBuffer = gl.createBuffer(); //GPU memory
	// gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer); //set triangleVertexBuffer as active buffer
	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); //send data to active buffer (buffer type, data cast to 32 bit float, cpu->gpu direct, with no subsequent changes)

	var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
	var positionColorAttributeLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttributeLocation,			//Attrib location in buffer
		2,									//Number of elements in attribute
		gl.FLOAT,							//Type of each element in attribute
		gl.FALSE,							//Is data normalized?
		5 * Float32Array.BYTES_PER_ELEMENT,	//Size of an individual vertex in bytes
		0									//Offset from the beginning of a single vertex to this attribute
	);

	gl.vertexAttribPointer(
		positionColorAttributeLocation,		//Attrib location in buffer
		3,									//Number of elements in attribute
		gl.FLOAT,							//Type of each element in attribute
		gl.FALSE,							//Is data normalized?
		5 * Float32Array.BYTES_PER_ELEMENT,	//Size of an individual vertex in bytes
		2 * Float32Array.BYTES_PER_ELEMENT	//Offset from the beginning of a single vertex to this attribute in bytes
	);

	gl.enableVertexAttribArray(positionAttributeLocation);	//enable attribute for use
	gl.enableVertexAttribArray(positionColorAttributeLocation);


	setBckrnd(gl);

	//Main render loop
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3); //uses active buffer

}