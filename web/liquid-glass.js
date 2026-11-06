(() => {
  const button = document.getElementById('play');
  const lens = button?.querySelector('.play-lens');
  const videos = [document.getElementById('filmA'), document.getElementById('filmB')];
  if (!button || !lens || videos.some(video => !video)) return;

  const fallback = () => {
    if (button.classList.contains('glass-ready')) button.classList.remove('glass-ready');
    if (!button.classList.contains('glass-fallback')) button.classList.add('glass-fallback');
  };
  const gl = lens.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) { fallback(); return; }
  lens.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); }, { passive: false });

  const vertex = `attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
  const fragment = `precision highp float;
    uniform sampler2D uScene;
    uniform vec2 uCanvas;
    uniform vec2 uViewport;
    uniform vec4 uButton;
    uniform float uDpr;
    uniform float uDiameter;
    vec3 sceneSample(vec2 uv){return texture2D(uScene,clamp(uv,vec2(0.),vec2(1.))).rgb;}
    void main(){
      vec2 local=gl_FragCoord.xy/uDpr;
      vec2 pagePoint=uButton.xy+vec2(local.x,uCanvas.y-local.y);
      vec2 q=(local-uCanvas*.5)/(uDiameter*.5);
      float r=length(q);
      float mask=1.-smoothstep(1.-1.5/uDiameter,1.+1.5/uDiameter,r);
      if(mask<.001){gl_FragColor=vec4(0.);return;}
      vec2 uv=vec2(pagePoint.x/uViewport.x,1.-pagePoint.y/uViewport.y);
      float normalZ=sqrt(max(.025,1.-r*r));
      vec2 surfaceNormal=q/normalZ;
      float rawDisplacement=(1./normalZ-1.)*uDiameter*.30;
      float maxDisplacement=uDiameter*.33;
      float lensDisplacement=maxDisplacement*rawDisplacement/(maxDisplacement+rawDisplacement);
      vec2 refractionOffset=surfaceNormal*lensDisplacement/uViewport;
      vec3 color=sceneSample(uv-refractionOffset);
      float alpha=.985*mask;
      gl_FragColor=vec4(color,alpha);
    }`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn('Liquid Glass is unavailable:', error);
    fallback();
    return;
  }

  gl.useProgram(program);
  const vertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const uniforms = Object.fromEntries(['uScene','uCanvas','uViewport','uButton','uDpr','uDiameter'].map(name => [name, gl.getUniformLocation(program, name)]));
  const scene = document.createElement('canvas');
  const sceneContext = scene.getContext('2d', { alpha: false });
  let drawPending = false;
  let lastWidth = 0, lastHeight = 0, lastTextureWidth = 0, lastTextureHeight = 0;
  let frameHandle = 0;

  function drawCover(video, context, opacity, width, height) {
    if (opacity <= .001 || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
    const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
    const sourceWidth = width / scale, sourceHeight = height / scale;
    const position = getComputedStyle(video).objectPosition.split(/\s+/);
    const px = Number.parseFloat(position[0]) / 100 || 0;
    const py = Number.parseFloat(position[1]) / 100 || 0;
    const sx = (video.videoWidth - sourceWidth) * px;
    const sy = (video.videoHeight - sourceHeight) * py;
    context.globalAlpha = opacity;
    context.drawImage(video, sx, sy, sourceWidth, sourceHeight, 0, 0, width, height);
    context.globalAlpha = 1;
  }

  function renderScene() {
    drawPending = false;
    if (document.body.classList.contains('minimal')) return;
    const width = window.innerWidth, height = window.innerHeight;
    const resolution = Math.min(1, 1280 / width, 720 / height);
    const textureWidth = Math.max(1, Math.round(width * resolution));
    const textureHeight = Math.max(1, Math.round(height * resolution));
    if (scene.width !== textureWidth || scene.height !== textureHeight) {
      scene.width = textureWidth;
      scene.height = textureHeight;
    }
    sceneContext.fillStyle = '#07110e';
    sceneContext.fillRect(0, 0, textureWidth, textureHeight);
    videos.forEach(video => drawCover(video, sceneContext, Number.parseFloat(getComputedStyle(video).opacity) || 0, textureWidth, textureHeight));
    const shade = sceneContext.createLinearGradient(0, 0, 0, textureHeight);
    shade.addColorStop(0, 'rgba(4,12,10,.25)');
    shade.addColorStop(.33, 'rgba(4,12,10,.02)');
    shade.addColorStop(.58, 'rgba(4,12,10,.28)');
    shade.addColorStop(1, 'rgba(4,12,10,.9)');
    sceneContext.fillStyle = shade;
    sceneContext.fillRect(0, 0, textureWidth, textureHeight);

    const rect = button.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasWidth = Math.max(1, Math.round(rect.width * dpr));
    const canvasHeight = Math.max(1, Math.round(rect.height * dpr));
    if (lens.width !== canvasWidth || lens.height !== canvasHeight) {
      lens.width = canvasWidth;
      lens.height = canvasHeight;
    }
    gl.viewport(0, 0, canvasWidth, canvasHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    try {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      if (lastTextureWidth !== textureWidth || lastTextureHeight !== textureHeight) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene);
        lastTextureWidth = textureWidth;
        lastTextureHeight = textureHeight;
      } else gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, scene);
    } catch (error) { console.warn('Liquid Glass frame upload failed:', error); fallback(); return; }
    gl.uniform1i(uniforms.uScene, 0);
    gl.uniform2f(uniforms.uCanvas, rect.width, rect.height);
    gl.uniform2f(uniforms.uViewport, width, height);
    gl.uniform4f(uniforms.uButton, rect.left, rect.top, rect.width, rect.height);
    gl.uniform1f(uniforms.uDpr, dpr);
    gl.uniform1f(uniforms.uDiameter, Math.min(rect.width, rect.height));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (gl.getError() !== gl.NO_ERROR) { fallback(); return; }
    button.classList.add('glass-ready');
    button.classList.remove('glass-fallback');
    lastWidth = width;
    lastHeight = height;
  }

  function scheduleDraw() {
    if (drawPending) return;
    drawPending = true;
    requestAnimationFrame(renderScene);
  }

  function followFrames(video) {
    if (typeof video.requestVideoFrameCallback === 'function') {
      const onFrame = () => { scheduleDraw(); if (!video.paused && !video.ended) frameHandle = video.requestVideoFrameCallback(onFrame); };
      video.addEventListener('play', () => { frameHandle = video.requestVideoFrameCallback(onFrame); }, { passive: true });
      video.addEventListener('pause', scheduleDraw, { passive: true });
      video.addEventListener('loadeddata', scheduleDraw, { passive: true });
      video.addEventListener('seeked', scheduleDraw, { passive: true });
    } else {
      const tick = () => { if (videos.some(item => !item.paused && !item.ended)) { scheduleDraw(); requestAnimationFrame(tick); } };
      video.addEventListener('play', () => requestAnimationFrame(tick), { passive: true });
      video.addEventListener('pause', scheduleDraw, { passive: true });
      video.addEventListener('loadeddata', scheduleDraw, { passive: true });
      video.addEventListener('seeked', scheduleDraw, { passive: true });
    }
  }

  videos.forEach(followFrames);
  window.addEventListener('resize', scheduleDraw, { passive: true });
  document.addEventListener('visibilitychange', scheduleDraw, { passive: true });
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(scheduleDraw);
    observer.observe(button);
    observer.observe(document.documentElement);
  }
  const stateObserver = new MutationObserver(scheduleDraw);
  stateObserver.observe(button, { attributes: true, attributeFilter: ['class'] });
  window.updatePlayGlass = scheduleDraw;
  scheduleDraw();
})();
