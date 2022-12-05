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

var setBckrnd = function(gl)
{
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

var compileRenderProg = function(gl)
{
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);		//Send shader source code to gl
	gl.shaderSource(fragmentShader, fragmentShaderText);	//Send shader source code to gl
	gl.compileShader(vertexShader);							//Compile shader source code
	gl.compileShader(fragmentShader);						//Compile shader source code
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
		console.error('Vertex Shader compile-time error', gl.getShaderInfoLog(vertexShader));
	else if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
		console.error('Fragment Shader compile-time error', gl.getShaderInfoLog(fragmentShader));
	else
	{
		var program = gl.createProgram();					//Create program (= shader pipeline)
		gl.attachShader(program, vertexShader);				//Attach shader to program
		gl.attachShader(program, fragmentShader);			//Attach shader to program
		return program;
	}
	return null;
}

var linkRenderProg = function(gl, program)
{
	var retVal;

	gl.linkProgram(program);
	if (!(retVal = gl.getProgramParameter(program, gl.LINK_STATUS)))
		console.error('Error linking program', gl.getProgramInfoLog(program));
	return retVal;
}

var InitDemo = function ()
{
	console.log('This is working');
	var canvas = document.getElementById('draw_canvas');
	var gl = canvas.getContext('webgl');
	var program;

	if (!gl)
		alert('Your browser does not support WebGL');

	//dynamic adjustments:
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	// gl.viewport(0, 0, window.innerWidth, window.innerHeight);

	setBckrnd(gl);
	if (!(program = compileRenderProg(gl)) || !linkRenderProg(gl, program))
		return;

	//DEBUG ONLY
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error('Error validating program', gl.getProgramInfoLog(program));
		return;
	}
	//DEBUG ONLY

	var triangleVertices =
	[ //x, y			R, G, B
		0.0, 0.5,		1.0, 0.0, 0.5,
		-0.5, -0.5,		1.0, 0.0, 1.0,
		0.5, -0.5,		0.0, 0.0, 1.0
	];

	var triangleVertexBuffer = gl.createBuffer(); //GPU memory
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer); //set triangleVertexBuffer as active buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); //send data to active buffer (buffer type, data cast to 32 bit float, cpu->gpu direct, with no subsequent changes)

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


	//Main render loop
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3); //uses active buffer

}