// A brain you can spin, drawn with WebGL from a simplified triangle mesh (no library).
// brain.bin holds: vertex count, triangle count, int16 positions, int8 normals, one flag byte
// per vertex (unused), then uint16 triangle indices.
// The surface is a rose skin shaded from the upper left. The edges of the triangles are drawn
// on it as fine lines, which is the net over the surface. Red veins run along those edges; each
// one is invisible until a pulse travels down it, then fades away again. The graphics card sorts out what is in front of
// what, so nothing flickers as the brain turns.

const LIGHT = [-0.45, 0.62, 0.64];
const VEIN = [0.7, 0.09, 0.15];
const HOT = [1, 0.42, 0.4];

const SURFACE_VS = `
attribute vec3 aPos; attribute vec3 aNrm; attribute vec3 aBary;
uniform vec3 r0, r1, r2;
varying vec3 vNrm; varying vec3 vBary;
void main() {
  vec3 p = vec3(dot(r0, aPos), dot(r1, aPos), dot(r2, aPos));
  float s = 3.4 / (3.4 - p.z);
  gl_Position = vec4(p.xy * s * 0.92, -p.z * 0.5, 1.0);
  vNrm = vec3(dot(r0, aNrm), dot(r1, aNrm), dot(r2, aNrm));
  vBary = aBary;
}`;
const SURFACE_FS = `
#extension GL_OES_standard_derivatives : enable
precision mediump float;
uniform vec3 light; uniform float alpha; uniform float wire;
varying vec3 vNrm; varying vec3 vBary;
void main() {
  vec3 n = normalize(vNrm);
  if (n.z < 0.0) n = -n; // a surface you can see always faces you
  float lit = max(dot(n, light), 0.0);
  float tone = clamp((1.0 - lit) * 0.72 + (1.0 - n.z) * (1.0 - n.z) * 0.4, 0.0, 1.0);
  vec3 col = mix(vec3(0.985, 0.89, 0.9), vec3(0.68, 0.35, 0.47), tone);
  if (wire > 0.5) {
    vec3 d = fwidth(vBary);
    vec3 a = smoothstep(vec3(0.0), d * 0.95, vBary);
    float edge = 1.0 - min(min(a.x, a.y), a.z);
    col = mix(col, vec3(0.36, 0.13, 0.25), edge * 0.13);
  }
  gl_FragColor = vec4(col * alpha, alpha);
}`;
// lines, pads and pulses: already in clip space; kind 0 = solid, 1 = disc, 2 = soft glow
const MARK_VS = `
attribute vec3 aClip; attribute vec3 aUv; attribute vec4 aCol;
varying vec3 vUv; varying vec4 vCol;
void main() { gl_Position = vec4(aClip, 1.0); vUv = aUv; vCol = aCol; }`;
const MARK_FS = `
precision mediump float;
varying vec3 vUv; varying vec4 vCol;
void main() {
  float r = length(vUv.xy);
  float a = vCol.a;
  if (vUv.z > 1.5) a *= pow(max(0.0, 1.0 - r), 2.0);
  else if (vUv.z > 0.5) a *= 1.0 - smoothstep(0.82, 1.0, r);
  gl_FragColor = vec4(vCol.rgb * a, a);
}`;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function program(gl, vs, fs) {
  const make = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

export function createBrain(canvas, url, { onSpin } = {}) {
  // Some browsers draw WebGL on the processor, not a graphics card (hardware acceleration off,
  // or no driver). That is far slower per pixel, so there the canvas is drawn smaller and
  // without edge smoothing, and stretched to fit.
  let slow = false;
  const probe = document.createElement('canvas').getContext('webgl');
  const info = probe && probe.getExtension('WEBGL_debug_renderer_info');
  if (info) slow = /basic render|swiftshader|llvmpipe|software/i.test(probe.getParameter(info.UNMASKED_RENDERER_WEBGL));
  const gl = canvas.getContext('webgl', { antialias: !slow, alpha: true, premultipliedAlpha: true });
  if (!gl) return { destroy() {} };
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = mulberry32(1998);
  const hasWire = !!gl.getExtension('OES_standard_derivatives');
  const surface = program(gl, SURFACE_VS, SURFACE_FS);
  const marks = program(gl, MARK_VS, MARK_FS);
  if (!surface || !marks) return { destroy() {} };

  let pos = null, count = 0, traces = [], pulses = [], glow = [];
  const surfaceBuf = gl.createBuffer(), markBuf = gl.createBuffer();
  let markData = new Float32Array(10 * 6 * 1200);
  let yaw = -0.6, pitch = 0.16, vYaw = 0, vPitch = 0;
  let dragging = false, lastX = 0, lastY = 0, spun = false;
  let w = 0, h = 0, dpr = 1, raf = 0, last = 0, born = 0, nextPulse = 1.2;
  let visible = true, dead = false;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = slow ? 0.8 : Math.min(window.devicePixelRatio || 1, 2);
    w = Math.round(r.width * dpr); h = Math.round(r.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    if (still) draw(0);
  };

  const build = (nv, nt, p16, n8, outer, tris) => {
    pos = new Float32Array(nv * 3);
    for (let i = 0; i < nv * 3; i++) pos[i] = p16[i] / 32767;
    // every triangle gets its own three corners, so each corner can carry the (1,0,0)-style
    // marker the shader uses to find the triangle's edges
    const data = new Float32Array(nt * 3 * 9);
    for (let t = 0; t < nt; t++) {
      for (let c = 0; c < 3; c++) {
        const v = tris[t * 3 + c], o = (t * 3 + c) * 9;
        data[o] = pos[v * 3]; data[o + 1] = pos[v * 3 + 1]; data[o + 2] = pos[v * 3 + 2];
        data[o + 3] = n8[v * 3] / 127; data[o + 4] = n8[v * 3 + 1] / 127; data[o + 5] = n8[v * 3 + 2] / 127;
        data[o + 6 + c] = 1;
      }
    }
    count = nt * 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, surfaceBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Gold traces: walks along triangle edges that prefer to keep going straight, so each one
    // reads as a circuit trace laid across the surface. They only use points flagged as being
    // on the outside of the whole brain, so a trace never dives into the gaps between lobes.
    const links = Array.from({ length: nv }, () => []);
    for (let t = 0; t < nt; t++) {
      for (let e = 0; e < 3; e++) {
        const a = tris[t * 3 + e], b = tris[t * 3 + (e + 1) % 3];
        if (!outer[a] || !outer[b]) continue;
        if (!links[a].includes(b)) links[a].push(b);
        if (!links[b].includes(a)) links[b].push(a);
      }
    }
    const used = new Set();
    for (let tries = 0; tries < 1200 && traces.length < 24; tries++) {
      let at = Math.floor(rand() * nv);
      if (used.has(at) || !outer[at]) continue;
      const path = [at];
      let dir = null;
      const want = 10 + Math.floor(rand() * 10);
      while (path.length < want) {
        let best = -1, bestScore = -2, bestStep = null;
        links[at].forEach((j) => {
          if (used.has(j) || path.includes(j)) return;
          const step = [pos[j * 3] - pos[at * 3], pos[j * 3 + 1] - pos[at * 3 + 1], pos[j * 3 + 2] - pos[at * 3 + 2]];
          const d = Math.hypot(step[0], step[1], step[2]) || 1;
          step[0] /= d; step[1] /= d; step[2] /= d;
          const score = (dir ? dir[0] * step[0] + dir[1] * step[1] + dir[2] * step[2] : 0) + rand() * 0.4;
          if (score > bestScore) { bestScore = score; best = j; bestStep = step; }
        });
        if (best < 0 || (dir && bestScore < 0)) break;
        dir = bestStep; at = best; path.push(at);
      }
      if (path.length < 8) continue;
      path.forEach((p) => { used.add(p); links[p].forEach((q) => used.add(q)); });
      traces.push(path);
    }
    glow = traces.map(() => 0);
  };

  const bind = (prog, buf, layout, stride) => {
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    let offset = 0;
    layout.forEach(([name, size]) => {
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * 4, offset * 4);
      offset += size;
    });
  };

  function draw(now) {
    if (!count || !w) return;
    const grow = still ? 1 : Math.min(1, (now - born) / 1200);
    const cy = Math.cos(yaw), sn = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    // rotation: yaw about the vertical axis, then pitch about the horizontal one
    const r0 = [cy, 0, sn], r1 = [sp * sn, cp, -sp * cy], r2 = [-cp * sn, sp, cp * cy];

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.BLEND);

    bind(surface, surfaceBuf, [['aPos', 3], ['aNrm', 3], ['aBary', 3]], 9);
    gl.uniform3fv(gl.getUniformLocation(surface, 'r0'), r0);
    gl.uniform3fv(gl.getUniformLocation(surface, 'r1'), r1);
    gl.uniform3fv(gl.getUniformLocation(surface, 'r2'), r2);
    gl.uniform3fv(gl.getUniformLocation(surface, 'light'), LIGHT);
    gl.uniform1f(gl.getUniformLocation(surface, 'alpha'), grow);
    gl.uniform1f(gl.getUniformLocation(surface, 'wire'), hasWire ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, count);

    // traces, pads and pulses are built on the CPU each frame as small flat shapes, pulled a
    // touch towards the viewer so they sit on top of the skin but hide behind the far side
    let o = 0;
    const clip = (v) => {
      const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
      const pz = r2[0] * x + r2[1] * y + r2[2] * z;
      const s = 3.4 / (3.4 - pz) * 0.92;
      return [(r0[0] * x + r0[2] * z) * s, (r1[0] * x + r1[1] * y + r1[2] * z) * s, -pz * 0.5 - 0.02];
    };
    const put = (x, y, z, u, v, kind, col, a) => {
      if (o + 10 > markData.length) return;
      markData[o++] = x; markData[o++] = y; markData[o++] = z;
      markData[o++] = u; markData[o++] = v; markData[o++] = kind;
      markData[o++] = col[0]; markData[o++] = col[1]; markData[o++] = col[2]; markData[o++] = a;
    };
    const quad = (c, half, kind, col, a) => {
      [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]].forEach(([u, v]) => put(c[0] + u * half, c[1] + v * half, c[2], u, v, kind, col, a));
    };
    const px = 2 / w;
    const halfLine = 0.6 * dpr * px;
    traces.forEach((path, ti) => {
      // a vein only shows while a pulse is on it, and for a moment after
      const show = glow[ti] * grow * 0.9;
      if (show < 0.01) return;
      const pts = path.map(clip);
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len * halfLine, ny = dx / len * halfLine;
        put(a[0] - nx, a[1] - ny, a[2], 0, 0, 0, VEIN, show); put(a[0] + nx, a[1] + ny, a[2], 0, 0, 0, VEIN, show); put(b[0] + nx, b[1] + ny, b[2], 0, 0, 0, VEIN, show);
        put(a[0] - nx, a[1] - ny, a[2], 0, 0, 0, VEIN, show); put(b[0] + nx, b[1] + ny, b[2], 0, 0, 0, VEIN, show); put(b[0] - nx, b[1] - ny, b[2], 0, 0, 0, VEIN, show);
      }
    });
    const solid = o;
    pulses.forEach((pl) => {
      const path = traces[pl.trace];
      const seg = Math.min(path.length - 2, Math.floor(pl.t));
      const a = clip(path[seg]), b = clip(path[seg + 1]), f = pl.t - seg;
      const fade = Math.min(1, pl.t * 2, (path.length - 1 - pl.t) * 2) * grow;
      quad([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f - 0.004], 8 * dpr * px, 2, HOT, fade);
    });
    bind(marks, markBuf, [['aClip', 3], ['aUv', 3], ['aCol', 4]], 10);
    gl.bufferData(gl.ARRAY_BUFFER, markData.subarray(0, o), gl.DYNAMIC_DRAW);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, solid / 10);
    gl.depthMask(false);
    gl.drawArrays(gl.TRIANGLES, solid / 10, (o - solid) / 10);
  }

  const frame = (now) => {
    raf = 0;
    if (dead) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (!dragging) {
      yaw += vYaw + 0.14 * dt; pitch += vPitch;
      vYaw *= 0.94; vPitch *= 0.9;
      pitch += (0.16 - pitch) * 0.01;
    }
    pitch = Math.max(-1.1, Math.min(1.1, pitch));
    nextPulse -= dt;
    if (nextPulse <= 0 && traces.length) {
      const pick = Math.floor(Math.random() * traces.length);
      if (!pulses.some((pl) => pl.trace === pick)) pulses.push({ trace: pick, t: 0 });
      nextPulse = 0.25 + Math.random() * 0.5;
    }
    pulses = pulses.filter((pl) => { pl.t += dt * 4.5; return pl.t < traces[pl.trace].length - 1; });
    // each vein eases in while a pulse is on it and eases out after
    for (let i = 0; i < traces.length; i++) {
      const active = pulses.some((pl) => pl.trace === i);
      glow[i] += ((active ? 1 : 0) - glow[i]) * Math.min(1, dt * (active ? 9 : 2.2));
    }
    draw(now);
    if (visible) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && !dead && !still && visible && count) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const onDown = (e) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; vYaw = 0; vPitch = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('dragging');
  };
  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    vYaw = dx * 0.008; vPitch = dy * 0.006;
    yaw += vYaw; pitch += vPitch;
    if (!spun && Math.abs(dx) + Math.abs(dy) > 2) { spun = true; if (onSpin) onSpin(); }
    if (still) draw(0);
  };
  const onUp = () => { dragging = false; canvas.classList.remove('dragging'); };
  const onKey = (e) => {
    const step = { ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] }[e.key];
    if (!step) return;
    e.preventDefault();
    yaw += step[0]; pitch += step[1];
    if (!spun) { spun = true; if (onSpin) onSpin(); }
    if (still) draw(0);
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('keydown', onKey);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick(); });
  io.observe(canvas);

  fetch(url)
    .then((r) => r.arrayBuffer())
    .then((buf) => {
      if (dead) return;
      const head = new DataView(buf);
      const nv = head.getUint32(0, true), nt = head.getUint32(4, true);
      const at = 8 + nv * 10;
      build(nv, nt, new Int16Array(buf, 8, nv * 3), new Int8Array(buf, 8 + nv * 6, nv * 3), new Uint8Array(buf, 8 + nv * 9, nv), new Uint16Array(buf, at + (at % 2), nt * 3));
      born = performance.now();
      resize();
      if (still) draw(0); else kick();
    })
    .catch(() => {});

  return {
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('keydown', onKey);
    },
  };
}
