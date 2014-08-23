var GL = function(canvas) {

	var shaders = [], currentShader;
	var glWidth, glHeight, aspect = 1;//cnv.width / cnv.height;

	var hasVideoTexture = false, video, videoAspect = 1;
	var textures = [];

	// number of items in the array (6 vertices in this case)
    var numItems = 6;
	// size of the position attribute (x,y)
	var posSize = 2;
	// size of the color attribute (r,g,b)
	var uvSize = 2;
	// total size of the stride (*4 because stride and offset below need to be expressed in bytes)
	var stride = (posSize + uvSize) * 4;
	// offset of the position attribute (0, but the variable is here for clarity)
	var posOffset = 0;
	// offset of the color
	var uvOffset = posSize * 4;
	// pffset of the unused part

	var gl = canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });

	var mainTexture = gl.createTexture();
	var buffer = gl.createBuffer();

	var verticesBack = new Float32Array([

    //  position    uv     
       -1.0,  1.0,  0, 1,
        1.0,  1.0,  1, 1,
        1.0, -1.0,  1, 0,

       -1.0,  1.0,  0, 1,
        1.0, -1.0,  1, 0, 
       -1.0, -1.0,  0, 0

    ]);

    var verticesFront = new Float32Array([

    //  position    uv     
       -1.0,  1.0,  1, 1,
        1.0,  1.0,  0, 1,
        1.0, -1.0,  0, 0,

       -1.0,  1.0,  1, 1,
        1.0, -1.0,  0, 0, 
       -1.0, -1.0,  1, 0

    ]);

	this.resize = function(w, h) {
		glWidth = w;
		glHeight = h;
		aspect = w / h;
	}

	this.render = function() {
		if(!currentShader) return;

		gl.viewport(0, 0, glWidth, glHeight);
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		if(hasVideoTexture) {
			gl.activeTexture(33984 + 1);
			gl.bindTexture(gl.TEXTURE_2D, mainTexture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
			gl.uniform1i(currentShader.program.uTexture, 1);
			gl.uniform2fv(currentShader.program.uVideoAspect, videoAspect); 

			if(textures['ramp'] && currentShader.program.uRamp != -1) {
				gl.activeTexture(33984 + 2);
				var t = textures['ramp'];
				gl.bindTexture(gl.TEXTURE_2D, t.tex);
				gl.uniform1i(currentShader.program.uRamp, 2);

			}
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.drawArrays(gl.TRIANGLES, 0, numItems);
	}

	this.setGeometry = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesBack, gl.STATIC_DRAW);
	}

	this.setVideoTexture = function(_video, _videoAspectWidth, _videoAspectHeight, source) {

		var v = (source.front) ? verticesFront : verticesBack;

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);


		video = _video;
		videoAspect = [_videoAspectWidth, _videoAspectHeight];

		gl.bindTexture(gl.TEXTURE_2D, mainTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        hasVideoTexture = true;
	}

	this.cancelVideoTexture = function() {
		hasVideoTexture = false;
	}

	this.loadRamp = function() {
		var image = new Image();

		image.addEventListener('load', function(e) {
			setTexture('ramp', image);
		});

		image.src = 'textures/popart-ramp.png';
	}

	var setTexture = function(name, image) {
		var t = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
		gl.bindTexture(gl.TEXTURE_2D, null);	

		textures[name] = {
			tex: t,
			img: image
		};
	}

	this.setShader = function(name, callback) {
		if(shaders[name]) {
			var s = shaders[name];
			gl.useProgram(s.program);
			currentShader = s;
		} else {
			Loader.loadGLSL('glsl/' + name + '.glsl', function(vertex, fragment) {

				var s = {};

				var program = gl.createProgram();

				var vs = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(vs, vertex);
				gl.compileShader(vs);
				 
				var fs = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(fs, fragment);
				gl.compileShader(fs);
				 
				gl.attachShader(program, vs);
				gl.attachShader(program, fs);
				gl.linkProgram(program);

				var shaderError = false;

				if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
					console.error("SHADER COMPILE ERROR", gl.getShaderInfoLog(vs));
					shaderError = true;
				}

				if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
					console.error("SHADER COMPILE ERROR", gl.getShaderInfoLog(fs));
					shaderError = true;
				}

				if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
					console.error("SHADER LINKING ERROR", gl.getProgramInfoLog(program));
					shaderError = true;
				}

				if(shaderError) return;

				gl.useProgram(program);

				program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
				program.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");

				gl.vertexAttribPointer(program.aVertexPosition, posSize, gl.FLOAT, false, stride, posOffset);
        		gl.vertexAttribPointer(program.aTextureCoord, uvSize, gl.FLOAT, false, stride, uvOffset);

				gl.enableVertexAttribArray(program.aVertexPosition);
				gl.enableVertexAttribArray(program.aTextureCoord);

				program.uTexture = gl.getUniformLocation(program, "uTexture");
				program.uVideoAspect = gl.getUniformLocation(program, "uVideoAspect");

				program.uRamp = gl.getUniformLocation(program, "uRamp") || -1;

        		s.program = program;
				shaders[name] = s;

				currentShader = s;

				console.log('shader loaded:', name);
			});
		}
	}
}