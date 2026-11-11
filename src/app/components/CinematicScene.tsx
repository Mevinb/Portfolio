import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CAMERA_KEYS, FINALE, GATE_UNLOCK, GROUP_WINDOWS, RESOLVE, smoothstep, windowAlpha } from './cinematicTimeline';

interface CinematicSceneProps {
  progress: MotionValue<number>;
  onReady: () => void;
  onUnavailable: () => void;
}

/** Everything an act needs to advance one frame. */
interface Frame {
  elapsed: number;
  delta: number;
  /** Smoothed scroll progress, 0..1. */
  p: number;
  /** This act's cross-dissolve, 0..1. */
  alpha: number;
  /** Whitewash toward `--paper`, 0..1. */
  wash: number;
  camera: THREE.PerspectiveCamera;
  pointerX: number;
  pointerY: number;
}

interface Act {
  group: THREE.Group;
  update: (frame: Frame) => void;
}

/** Collects GPU resources so teardown is one loop. */
class Resources {
  private items: { dispose: () => void }[] = [];
  track<T extends { dispose: () => void }>(item: T) {
    this.items.push(item);
    return item;
  }
  dispose() {
    this.items.forEach((item) => item.dispose());
    this.items = [];
  }
}

const BLUE = new THREE.Color('#2f6dff');
const CORAL = new THREE.Color('#ff594d');
const YELLOW = new THREE.Color('#f6d94a');

const DARK_BACKGROUND = '#050711';
const MOBILE_QUERY = '(max-width: 760px)';
const FOG_DENSITY = 0.019;

/** Single place the mobile budget is decided, so createWorld and resize agree. */
function viewportProfile() {
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  return {
    isMobile,
    fov: isMobile ? 66 : 58,
    pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1.15 : 1.5),
  };
}

/**
 * The finale hands off to the site, so it brightens toward the live `--paper`
 * token rather than a hardcoded near-white. In dark mode that keeps the arrival
 * from flashing white and then dropping to near-black.
 */
function readPaperColor() {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
    if (raw) return new THREE.Color(raw);
  } catch {
    /* computed styles unavailable — fall through */
  }
  return new THREE.Color('#dce6ff');
}

/** Deterministic, so the sculpture is identical on every visit and replay. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// Custom shaders are not fogged by the renderer, so they share this.
const FOG_GLSL = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  vec3 applyFog(vec3 color, float depth) {
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * depth * depth);
    return mix(color, uFogColor, fog);
  }
`;

// Correct both when rendering to the composer and straight to the canvas.
const OUTPUT_GLSL = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

type FogUniforms = { uFogColor: { value: THREE.Color }; uFogDensity: { value: number } };

/**
 * Act one — AI vision. A cloud of latent noise denoises into an eye: a lattice
 * globe, an iris of radial fibres and a bright pupil ring. It turns to keep
 * looking at the camera, then scatters as the camera flies through it.
 */
function buildVisionAct(resources: Resources, isMobile: boolean, pointScale: { value: number }): Act {
  const group = new THREE.Group();
  const random = seededRandom(7);
  const count = isMobile ? 6500 : 16000;
  const RADIUS = 2.3;

  const noise = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  const sclera = new THREE.Color('#4a63b8').multiplyScalar(0.4);
  const irisOuter = new THREE.Color('#1c4fe0');
  const irisInner = new THREE.Color('#ff6b5e');
  const fleck = new THREE.Color('#cfe0ff');
  const halo = new THREE.Color('#8fb0ff').multiplyScalar(0.5);
  const scratch = new THREE.Color();
  const point = new THREE.Vector3();
  const tilt = new THREE.Euler();

  const PUPIL = 0.4;
  const IRIS = 0.92;
  // On a unit sphere, z > cos(angle) is the cap within `angle` of the +z pole.
  const irisCap = Math.cos(IRIS);

  for (let index = 0; index < count; index += 1) {
    const share = index / count;
    const s = random();
    seed[index] = s;

    if (share < 0.44) {
      // Globe: an even lattice everywhere except the cap the iris occupies.
      const z = -1 + (1 + irisCap) * random();
      const azimuth = index * 2.399963;
      const ring = Math.sqrt(1 - z * z);
      point.set(Math.cos(azimuth) * ring, Math.sin(azimuth) * ring, z).multiplyScalar(RADIUS);
      scratch.copy(sclera);
    } else if (share < 0.83) {
      // Iris: fibres radiating from the pupil, slightly proud of the globe.
      const polar = PUPIL + (IRIS - PUPIL) * Math.pow(random(), 0.8);
      const fibre = Math.floor(random() * 240) / 240 * Math.PI * 2 + (random() - 0.5) * 0.012;
      const lift = RADIUS * (1.012 + random() * 0.02);
      point.set(Math.sin(polar) * Math.cos(fibre), Math.sin(polar) * Math.sin(fibre), Math.cos(polar)).multiplyScalar(lift);
      const t = (polar - PUPIL) / (IRIS - PUPIL);
      scratch.copy(irisInner).lerp(irisOuter, Math.min(1, t * 1.7));
      if (random() > 0.9) scratch.lerp(fleck, 0.8);
    } else if (share < 0.88) {
      const azimuth = random() * Math.PI * 2;
      const polar = PUPIL + (random() - 0.5) * 0.02;
      point.set(Math.sin(polar) * Math.cos(azimuth), Math.sin(polar) * Math.sin(azimuth), Math.cos(polar)).multiplyScalar(RADIUS * 1.03);
      scratch.copy(YELLOW);
    } else {
      // Two tilted aperture rings orbiting the globe.
      const outer = share > 0.94;
      const azimuth = random() * Math.PI * 2;
      const radius = (outer ? 3.9 : 3.3) + (random() - 0.5) * 0.05;
      point.set(Math.cos(azimuth) * radius, Math.sin(azimuth) * radius, 0);
      point.applyEuler(tilt.set(outer ? 1.15 : -0.9, outer ? 0.35 : 0.5, 0));
      scratch.copy(halo);
    }
    point.toArray(target, index * 3);
    scratch.toArray(color, index * 3);

    // Noise: a loose shell the form condenses out of.
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const spread = 2.6 + Math.pow(random(), 0.7) * 6.2;
    const ring = Math.sqrt(1 - u * u);
    noise[index * 3] = Math.cos(theta) * ring * spread;
    noise[index * 3 + 1] = u * spread * 0.8;
    noise[index * 3 + 2] = Math.sin(theta) * ring * spread;
  }

  const geometry = resources.track(new THREE.BufferGeometry());
  geometry.setAttribute('position', new THREE.BufferAttribute(noise, 3));
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  // The shader moves every vertex, so the noise bounds would cull it wrongly.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);

  const uniforms = {
    uTime: { value: 0 },
    uResolve: { value: 0 },
    uBurst: { value: 0 },
    uAlpha: { value: 1 },
    uSize: { value: isMobile ? 0.05 : 0.04 },
    uScale: pointScale,
  };
  const material = resources.track(new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uTime, uResolve, uBurst, uSize, uScale;
      attribute vec3 aTarget, aColor;
      attribute float aSeed;
      varying vec3 vColor;
      varying float vFade;
      void main() {
        // Each particle settles on its own schedule, so the form resolves in waves.
        float settle = smoothstep(0.0, 1.0, clamp(uResolve * 1.7 - aSeed * 0.7, 0.0, 1.0));
        float t = uTime * 0.22 + aSeed * 40.0;
        vec3 drift = vec3(sin(t * 1.3 + position.y), cos(t * 1.1 + position.z), sin(t * 0.9 + position.x)) * 0.55;
        vec3 p = mix(position + drift, aTarget, settle);
        // Unsettled particles spiral in rather than travelling in straight lines.
        float angle = (1.0 - settle) * 2.2 * (0.4 + aSeed);
        float c = cos(angle), s = sin(angle);
        p.xz = mat2(c, -s, s, c) * p.xz;
        p += normalize(position) * uBurst * (4.0 + aSeed * 16.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = uSize * (0.55 + aSeed * 0.9) * mix(1.3, 1.0, settle) * uScale * projectionMatrix[1][1] / -mv.z;
        // Capped and faded up close, so flying through the cloud never fills the frame.
        gl_PointSize = min(size, uScale * 0.012);
        vColor = mix(vec3(0.3, 0.45, 1.0), aColor, settle);
        vFade = (1.0 - uBurst * 0.5) * smoothstep(0.4, 2.2, -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      varying vec3 vColor;
      varying float vFade;
      void main() {
        float falloff = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
        gl_FragColor = vec4(vColor, falloff * 0.72 * uAlpha * vFade);
        ${OUTPUT_GLSL}
      }
    `,
  }));
  group.add(new THREE.Points(geometry, material));

  // An opaque globe inside the lattice hides the far side, so it reads as solid.
  const bodyGeometry = resources.track(new THREE.SphereGeometry(RADIUS * 0.975, 48, 32));
  const bodyMaterial = resources.track(new THREE.ShaderMaterial({
    uniforms: { uRim: { value: BLUE.clone() } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal, vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRim;
      varying vec3 vNormal, vView;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 4.0);
        gl_FragColor = vec4(vec3(0.004, 0.006, 0.016) + uRim * rim * 0.5, 1.0);
        ${OUTPUT_GLSL}
      }
    `,
  }));
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  const aim = new THREE.Object3D();
  const gaze = new THREE.Vector3();

  return {
    group,
    update({ elapsed, delta, p, alpha, camera, pointerX, pointerY }) {
      const resolve = smoothstep(RESOLVE.form[0], RESOLVE.form[1], p);
      const burst = smoothstep(RESOLVE.scatter[0], RESOLVE.scatter[1], p);
      uniforms.uTime.value = elapsed;
      uniforms.uResolve.value = resolve;
      uniforms.uBurst.value = burst;
      uniforms.uAlpha.value = alpha;
      body.scale.setScalar(Math.max(0.0001, resolve * resolve * (1 - burst) ** 3));

      // The eye follows the camera, nudged by the pointer.
      gaze.copy(camera.position);
      gaze.x += pointerX * 9;
      gaze.y -= pointerY * 9;
      aim.position.copy(group.position);
      aim.lookAt(gaze);
      group.quaternion.slerp(aim.quaternion, 1 - Math.pow(0.02, delta));
    },
  };
}

/**
 * Act two — secure systems. A vault corridor of heavy gates that sit rotated
 * out of true and swing square as the camera reaches them, a scan sheet
 * sweeping its length, traffic running the walls, and a guarded core.
 */
function buildSecurityAct(resources: Resources, isMobile: boolean): Act {
  const group = new THREE.Group();
  group.position.z = -18;
  const random = seededRandom(23);
  const fades: { material: THREE.Material; base: number }[] = [];

  const OUTER = 4.05;
  const INNER = 3.5;
  const shape = new THREE.Shape([new THREE.Vector2(-OUTER, -OUTER), new THREE.Vector2(OUTER, -OUTER), new THREE.Vector2(OUTER, OUTER), new THREE.Vector2(-OUTER, OUTER)]);
  shape.holes.push(new THREE.Path([new THREE.Vector2(-INNER, -INNER), new THREE.Vector2(-INNER, INNER), new THREE.Vector2(INNER, INNER), new THREE.Vector2(INNER, -INNER)]));
  const gateGeometry = resources.track(new THREE.ExtrudeGeometry(shape, { depth: 0.34, bevelEnabled: false }));
  const gateEdges = resources.track(new THREE.EdgesGeometry(gateGeometry));
  const gateMaterial = resources.track(new THREE.MeshStandardMaterial({ color: '#0c1222', metalness: 0.85, roughness: 0.38, transparent: true }));
  const edgeMaterial = resources.track(new THREE.LineBasicMaterial({ color: '#ff6b61', transparent: true }));
  fades.push({ material: gateMaterial, base: 1 }, { material: edgeMaterial, base: 0.9 });

  const gates: { object: THREE.Group; locked: number; opensAt: number }[] = [];
  const GATE_COUNT = 10;
  for (let index = 0; index < GATE_COUNT; index += 1) {
    const gate = new THREE.Group();
    gate.add(new THREE.Mesh(gateGeometry, gateMaterial), new THREE.LineSegments(gateEdges, edgeMaterial));
    gate.position.z = -index * 2.3;
    gate.scale.setScalar(1 - index * 0.012);
    group.add(gate);
    gates.push({
      object: gate,
      locked: (index % 2 ? -1 : 1) * (0.42 + index * 0.05),
      opensAt: GATE_UNLOCK[0] + (GATE_UNLOCK[1] - GATE_UNLOCK[0]) * (index / (GATE_COUNT - 1)),
    });
  }

  // The guarded core: a faceted solid inside a counter-rotating cage.
  const core = new THREE.Group();
  core.position.z = -10;
  const solidGeometry = resources.track(new THREE.IcosahedronGeometry(0.95, 0));
  const solidMaterial = resources.track(new THREE.MeshStandardMaterial({ color: '#1a0f14', emissive: '#ff2f28', emissiveIntensity: 0.55, metalness: 0.7, roughness: 0.3, flatShading: true, transparent: true }));
  const solid = new THREE.Mesh(solidGeometry, solidMaterial);
  const cageGeometry = resources.track(new THREE.IcosahedronGeometry(1.3, 1));
  const cageMaterial = resources.track(new THREE.MeshBasicMaterial({ color: '#ff8a80', wireframe: true, transparent: true }));
  const cage = new THREE.Mesh(cageGeometry, cageMaterial);
  const orbitGeometry = resources.track(new THREE.TorusGeometry(1.6, 0.014, 6, 96));
  const orbitMaterial = resources.track(new THREE.MeshBasicMaterial({ color: '#ff8f86', transparent: true }));
  const orbits = [new THREE.Mesh(orbitGeometry, orbitMaterial), new THREE.Mesh(orbitGeometry, orbitMaterial)];
  orbits[1].rotation.x = Math.PI / 2;
  core.add(solid, cage, ...orbits);
  group.add(core);
  fades.push({ material: solidMaterial, base: 1 }, { material: cageMaterial, base: 0.55 }, { material: orbitMaterial, base: 0.6 });

  // A sheet of scanlines the camera flies through.
  const scanUniforms = { uTime: { value: 0 }, uAlpha: { value: 0 }, uColor: { value: CORAL.clone() } };
  const scanGeometry = resources.track(new THREE.PlaneGeometry(INNER * 2, INNER * 2));
  const scanMaterial = resources.track(new THREE.ShaderMaterial({
    uniforms: scanUniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying float vDepth;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uAlpha;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying float vDepth;
      void main() {
        float lines = step(0.5, fract(vUv.y * 46.0 - uTime * 1.5));
        vec2 edge = abs(vUv - 0.5) * 2.0;
        float frame = smoothstep(0.94, 1.0, max(edge.x, edge.y));
        // Thins out up close, so passing through it is a flicker, not a red wall.
        float near = smoothstep(1.5, 9.0, vDepth);
        gl_FragColor = vec4(uColor, (lines * 0.022 + frame * 0.45) * near * uAlpha);
        ${OUTPUT_GLSL}
      }
    `,
  }));
  const scan = new THREE.Mesh(scanGeometry, scanMaterial);
  group.add(scan);

  // Traffic: packets running the four walls of the corridor.
  const packetCount = isMobile ? 70 : 150;
  const packetGeometry = resources.track(new THREE.BoxGeometry(0.035, 0.035, 0.42));
  const packetMaterial = resources.track(new THREE.MeshBasicMaterial({ color: '#ff7a70', transparent: true }));
  const packets = resources.track(new THREE.InstancedMesh(packetGeometry, packetMaterial, packetCount));
  packets.frustumCulled = false;
  const lanes = Array.from({ length: packetCount }, (_, index) => {
    const wall = index % 4;
    const across = (random() * 2 - 1) * (INNER - 0.5);
    const fixed = (wall < 2 ? 1 : -1) * (INNER - 0.22);
    return { x: wall % 2 ? across : fixed, y: wall % 2 ? fixed : across, offset: random() * 30, speed: 3 + random() * 6 };
  });
  group.add(packets);
  fades.push({ material: packetMaterial, base: 0.7 });

  const matrix = new THREE.Matrix4();

  return {
    group,
    update({ elapsed, p, alpha }) {
      for (const fade of fades) fade.material.opacity = fade.base * alpha;

      for (const gate of gates) {
        const open = smoothstep(gate.opensAt - 0.07, gate.opensAt, p);
        gate.object.rotation.z = gate.locked * (1 - open) + Math.sin(elapsed * 0.4 + gate.locked * 9) * 0.012;
      }

      solid.rotation.set(elapsed * 0.35, elapsed * 0.5, 0);
      cage.rotation.set(-elapsed * 0.2, -elapsed * 0.28, elapsed * 0.1);
      orbits[0].rotation.y = elapsed * 0.6;
      orbits[1].rotation.z = elapsed * 0.45;

      scan.position.z = 1 - ((elapsed * 4.5) % 24);
      scanUniforms.uTime.value = elapsed;
      scanUniforms.uAlpha.value = alpha;

      for (let index = 0; index < packetCount; index += 1) {
        const lane = lanes[index];
        matrix.makeTranslation(lane.x, lane.y, 3 - ((lane.offset + elapsed * lane.speed) % 30));
        packets.setMatrixAt(index, matrix);
      }
      packets.instanceMatrix.needsUpdate = true;
    },
  };
}

/**
 * Act three — GPU infrastructure. Two rows of racks with live status LEDs over
 * a gridded floor, data running the aisle toward a portal the exit wipe
 * continues out of.
 */
function buildDeployAct(resources: Resources, isMobile: boolean, fog: FogUniforms, paper: THREE.Color): Act {
  const group = new THREE.Group();
  group.position.z = -43;
  const random = seededRandom(41);

  const AISLE = 4.2;
  const PITCH = 2.75;
  const rackCount = isMobile ? 24 : 42;
  const rackGeometry = resources.track(new THREE.BoxGeometry(1.45, 4.9, 1.3));
  const rackMaterial = resources.track(new THREE.MeshStandardMaterial({ color: '#0d1426', emissive: '#12296a', emissiveIntensity: 0.45, metalness: 0.8, roughness: 0.34, transparent: true }));
  const racks = resources.track(new THREE.InstancedMesh(rackGeometry, rackMaterial, rackCount));

  // Status LEDs sit on each rack's aisle-facing side and follow its transform.
  const LEDS_PER_RACK = 12;
  const ledCount = rackCount * LEDS_PER_RACK;
  const ledGeometry = resources.track(new THREE.BoxGeometry(0.03, 0.06, 0.22));
  const ledUniforms = { uTime: { value: 0 }, uAlpha: { value: 1 }, ...fog };
  const ledMaterial = resources.track(new THREE.ShaderMaterial({
    uniforms: ledUniforms,
    transparent: true,
    vertexShader: /* glsl */ `
      uniform float uTime;
      attribute float aPhase;
      varying float vLevel, vKind, vDepth;
      void main() {
        float blink = step(0.35, fract(uTime * (0.3 + aPhase * 1.6) + aPhase * 13.0));
        vLevel = mix(0.18, 1.0, blink);
        vKind = step(0.8, aPhase);
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      varying float vLevel, vKind, vDepth;
      ${FOG_GLSL}
      void main() {
        vec3 color = mix(vec3(0.2, 0.42, 1.0), vec3(1.0, 0.82, 0.25), vKind) * vLevel * 1.25;
        gl_FragColor = vec4(applyFog(color, vDepth), uAlpha);
        ${OUTPUT_GLSL}
      }
    `,
  }));
  const leds = resources.track(new THREE.InstancedMesh(ledGeometry, ledMaterial, ledCount));
  const phases = new Float32Array(ledCount);

  const rack = new THREE.Object3D();
  const led = new THREE.Object3D();
  for (let index = 0; index < rackCount; index += 1) {
    const side = index % 2 ? 1 : -1;
    rack.position.set(side * AISLE, index % 4 < 2 ? -0.25 : 0.25, -Math.floor(index / 2) * PITCH);
    rack.rotation.y = -side * 0.11;
    rack.updateMatrix();
    racks.setMatrixAt(index, rack.matrix);
    for (let slot = 0; slot < LEDS_PER_RACK; slot += 1) {
      led.position.set(-side * 0.74, -1.85 + Math.floor(slot / 2) * 0.72, slot % 2 ? 0.26 : -0.26);
      led.updateMatrix();
      led.matrix.premultiply(rack.matrix);
      leds.setMatrixAt(index * LEDS_PER_RACK + slot, led.matrix);
      phases[index * LEDS_PER_RACK + slot] = random();
    }
  }
  ledGeometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));
  racks.instanceMatrix.needsUpdate = true;
  leds.instanceMatrix.needsUpdate = true;
  // Instances span the whole aisle; the unit geometry's bounds would cull them.
  racks.frustumCulled = false;
  leds.frustumCulled = false;
  group.add(racks, leds);

  // Floor: a grid with pulses travelling toward the portal.
  const floorUniforms = { uTime: { value: 0 }, uAlpha: { value: 1 }, ...fog };
  const floorGeometry = resources.track(new THREE.PlaneGeometry(44, 120));
  const floorMaterial = resources.track(new THREE.ShaderMaterial({
    uniforms: floorUniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vPlane;
      varying float vDepth;
      void main() {
        vPlane = position.xy;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uAlpha;
      varying vec2 vPlane;
      varying float vDepth;
      ${FOG_GLSL}
      void main() {
        vec2 cell = vPlane / 1.375;
        vec2 grid = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
        float line = 1.0 - min(min(grid.x, grid.y), 1.0);
        float aisle = smoothstep(3.4, 0.0, abs(vPlane.x));
        float pulse = smoothstep(0.93, 1.0, fract(vPlane.y * 0.045 - uTime * 0.22)) * aisle;
        vec3 color = vec3(0.012, 0.02, 0.05)
          + vec3(0.1, 0.22, 0.6) * line * (0.35 + aisle * 0.5)
          + vec3(1.0, 0.8, 0.25) * pulse * 0.6;
        gl_FragColor = vec4(applyFog(color, vDepth), uAlpha);
        ${OUTPUT_GLSL}
      }
    `,
  }));
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.72, -50);
  group.add(floor);

  // Data: streaks running the aisle floor and overhead trays.
  const streakCount = isMobile ? 12 : 22;
  const streakGeometry = resources.track(new THREE.BoxGeometry(0.05, 0.02, 3.2));
  const streakMaterial = resources.track(new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true }));
  const streaks = resources.track(new THREE.InstancedMesh(streakGeometry, streakMaterial, streakCount));
  streaks.frustumCulled = false;
  const tracks = Array.from({ length: streakCount }, (_, index) => ({
    x: (index % 2 ? 1 : -1) * (0.9 + (index % 3) * 0.75),
    y: index % 5 === 0 ? 3.05 : -2.66,
    offset: random() * 80,
    speed: 9 + random() * 9,
  }));
  group.add(streaks);

  // The portal: a ring and a field inside it that fills toward `--paper`.
  const PORTAL_Z = -32;
  const portalGeometry = resources.track(new THREE.TorusGeometry(5.5, 0.16, 10, 96));
  const portalMaterial = resources.track(new THREE.MeshBasicMaterial({ color: '#6fa0ff', transparent: true }));
  const portalBase = portalMaterial.color.clone();
  const portal = new THREE.Mesh(portalGeometry, portalMaterial);
  portal.position.z = PORTAL_Z;
  const fieldUniforms = { uTime: { value: 0 }, uAlpha: { value: 1 }, uWash: { value: 0 }, uPaper: { value: paper } };
  const fieldGeometry = resources.track(new THREE.CircleGeometry(5.4, 72));
  const fieldMaterial = resources.track(new THREE.ShaderMaterial({
    uniforms: fieldUniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uAlpha, uWash;
      uniform vec3 uPaper;
      varying vec2 vUv;
      void main() {
        vec2 centred = vUv - 0.5;
        float radius = length(centred) * 2.0;
        // Thin spiral arms rather than a filled disc, so it reads as an opening.
        float swirl = pow(sin(atan(centred.y, centred.x) * 5.0 + radius * 11.0 - uTime * 1.8) * 0.5 + 0.5, 6.0);
        float rim = smoothstep(0.25, 1.0, radius) * swirl * 0.5;
        float fill = smoothstep(1.0, 0.0, radius * (1.6 - uWash * 1.5)) * uWash;
        vec3 color = mix(vec3(0.3, 0.5, 1.0), uPaper, uWash);
        float edge = smoothstep(1.0, 0.7, radius);
        gl_FragColor = vec4(color, clamp(rim * (1.0 - uWash) + fill * edge, 0.0, 1.0) * uAlpha);
        ${OUTPUT_GLSL}
      }
    `,
  }));
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
  field.position.z = PORTAL_Z - 0.05;
  group.add(portal, field);

  const matrix = new THREE.Matrix4();

  return {
    group,
    update({ elapsed, alpha, wash }) {
      // Everything but the portal dissolves into the whitewash, so the last
      // frame resolves to a clean plate with only the ring on it.
      const body = alpha * (1 - wash * 0.94);
      rackMaterial.opacity = body;
      streakMaterial.opacity = body;
      ledUniforms.uAlpha.value = body;
      ledUniforms.uTime.value = elapsed;
      floorUniforms.uAlpha.value = body;
      floorUniforms.uTime.value = elapsed;

      group.position.y = Math.sin(elapsed * 0.3) * 0.1;
      for (let index = 0; index < streakCount; index += 1) {
        const track = tracks[index];
        matrix.makeTranslation(track.x, track.y, 6 - ((track.offset + elapsed * track.speed) % 80));
        streaks.setMatrixAt(index, matrix);
      }
      streaks.instanceMatrix.needsUpdate = true;

      // The ring blooms toward the paper colour and holds while everything
      // else clears, so the exit wipe reads as passing through it.
      portal.rotation.z = elapsed * 0.05;
      portalMaterial.color.copy(portalBase).lerp(paper, wash);
      portalMaterial.opacity = Math.max(0.9 * alpha, wash * 0.9);
      fieldUniforms.uTime.value = elapsed;
      fieldUniforms.uAlpha.value = Math.max(alpha, wash);
      fieldUniforms.uWash.value = wash;
    },
  };
}

interface CinematicWorld {
  renderer: THREE.WebGLRenderer;
  /** Null when post-processing could not be set up; the scene renders directly. */
  composer: EffectComposer | null;
  bloom: UnrealBloomPass | null;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  acts: { act: Act; window: keyof typeof GROUP_WINDOWS }[];
  dust: THREE.Points;
  fog: THREE.FogExp2;
  fogUniforms: FogUniforms;
  background: THREE.Color;
  paper: THREE.Color;
  pulseLights: THREE.PointLight[];
  /** Converts world-unit point sizes to device pixels; follows the canvas height. */
  pointScale: { value: number };
  resources: Resources;
}

const BLOOM_STRENGTH = 0.42;

function createWorld(canvas: HTMLCanvasElement): CinematicWorld {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  const { isMobile, fov, pixelRatio } = viewportProfile();
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const resources = new Resources();
  const scene = new THREE.Scene();
  const background = new THREE.Color(DARK_BACKGROUND);
  scene.background = background;
  const fog = new THREE.FogExp2(DARK_BACKGROUND, FOG_DENSITY);
  scene.fog = fog;
  const fogUniforms: FogUniforms = { uFogColor: { value: fog.color }, uFogDensity: { value: FOG_DENSITY } };
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 180);
  const paper = readPaperColor();

  scene.add(new THREE.AmbientLight('#7790c8', 0.4));
  const keyLight = new THREE.DirectionalLight('#ffffff', 1.7);
  keyLight.position.set(4, 8, 6);
  scene.add(keyLight);
  const pulseLights = [
    new THREE.PointLight(BLUE, 18, 24, 1.6),
    new THREE.PointLight(CORAL, 14, 26, 1.6),
    new THREE.PointLight(YELLOW, 12, 24, 1.8),
  ];
  pulseLights[0].position.set(-3, 1, 2);
  pulseLights[1].position.set(-1.5, 0.5, -27);
  pulseLights[2].position.set(0, 2, -50);
  scene.add(...pulseLights);

  const pointScale = { value: renderer.domElement.height * 0.5 };
  const acts: CinematicWorld['acts'] = [
    { act: buildVisionAct(resources, isMobile, pointScale), window: 'core' },
    { act: buildSecurityAct(resources, isMobile), window: 'security' },
    { act: buildDeployAct(resources, isMobile, fogUniforms, paper), window: 'deploy' },
  ];
  acts.forEach(({ act }) => scene.add(act.group));

  const dustCount = isMobile ? 700 : 1600;
  const positions = new Float32Array(dustCount * 3);
  const random = seededRandom(3);
  for (let index = 0; index < dustCount; index += 1) {
    positions[index * 3] = (random() - 0.5) * 34;
    positions[index * 3 + 1] = (random() - 0.5) * 22;
    positions[index * 3 + 2] = 14 - random() * 110;
  }
  const dustGeometry = resources.track(new THREE.BufferGeometry());
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dustMaterial = resources.track(new THREE.PointsMaterial({ color: '#98b5ff', size: isMobile ? 0.045 : 0.055, transparent: true, opacity: 0.6, sizeAttenuation: true }));
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);

  // Bloom is an enhancement: if the float targets it needs are unavailable,
  // the scene still renders directly.
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  try {
    composer = new EffectComposer(renderer);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2), BLOOM_STRENGTH, 0.55, 0.3);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  } catch (error) {
    console.warn('Cinematic bloom unavailable:', error);
    composer = null;
    bloom = null;
  }

  return { renderer, composer, bloom, scene, camera, acts, dust, fog, fogUniforms, background, paper, pulseLights, pointScale, resources };
}

/**
 * The camera flies one continuous spline through the authored keys instead of
 * easing to a stop at each, so the journey never stalls between acts.
 */
function createCameraPath() {
  const positions = new THREE.CatmullRomCurve3(CAMERA_KEYS.map((key) => new THREE.Vector3(...key.pos)), false, 'centripetal');
  const looks = new THREE.CatmullRomCurve3(CAMERA_KEYS.map((key) => new THREE.Vector3(...key.look)), false, 'centripetal');
  const last = CAMERA_KEYS.length - 1;
  return (progress: number, outPosition: THREE.Vector3, outLook: THREE.Vector3) => {
    let index = 0;
    while (index < last - 1 && progress > CAMERA_KEYS[index + 1].at) index += 1;
    const from = CAMERA_KEYS[index];
    const to = CAMERA_KEYS[index + 1];
    const local = THREE.MathUtils.clamp((progress - from.at) / (to.at - from.at), 0, 1);
    const u = (index + local) / last;
    positions.getPoint(u, outPosition);
    looks.getPoint(u, outLook);
  };
}

export function CinematicScene({ progress, onReady, onUnavailable }: CinematicSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let world: CinematicWorld;
    try {
      world = createWorld(canvas);
    } catch (error) {
      console.warn('WebGL cinematic unavailable:', error);
      onUnavailable();
      return;
    }

    let frameId = 0;
    let resizeFrame = 0;
    let targetProgress = progress.get();
    let currentProgress = targetProgress;
    let pointerX = 0;
    let pointerY = 0;
    let visible = !document.hidden;
    let readyFired = false;
    let contextLost = false;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const unsubscribe = progress.on('change', (value) => { targetProgress = value; });
    const handlePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 0.7;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    const applyViewport = () => {
      const { fov, pixelRatio } = viewportProfile();
      world.camera.aspect = window.innerWidth / window.innerHeight;
      world.camera.fov = fov;
      world.camera.updateProjectionMatrix();
      world.renderer.setPixelRatio(pixelRatio);
      world.renderer.setSize(window.innerWidth, window.innerHeight, false);
      world.composer?.setPixelRatio(pixelRatio);
      world.composer?.setSize(window.innerWidth, window.innerHeight);
      world.pointScale.value = world.renderer.domElement.height * 0.5;
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
    };
    // iOS fires resize in bursts as the URL bar collapses, and each pass would
    // reallocate the drawing buffer. Coalesce to one per frame, and ignore the
    // small height-only deltas that the URL bar produces.
    const handleResize = () => {
      const widthChanged = window.innerWidth !== lastWidth;
      const heightDelta = Math.abs(window.innerHeight - lastHeight);
      if (!widthChanged && heightDelta < 120) return;
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        applyViewport();
      });
    };

    const handleVisibility = () => { visible = !document.hidden; };
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      onUnavailable();
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    canvas.addEventListener('webglcontextlost', handleContextLoss);

    const samplePath = createCameraPath();
    const darkBackground = new THREE.Color(DARK_BACKGROUND);
    const position = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    const frame: Frame = { elapsed: 0, delta: 0, p: 0, alpha: 0, wash: 0, camera: world.camera, pointerX: 0, pointerY: 0 };
    let lastTime = performance.now();

    const render = () => {
      frameId = requestAnimationFrame(render);
      if (!visible) return;

      // Frame-rate independent smoothing: a fixed factor would let a 120Hz
      // display catch up twice as fast and drift out of sync with the copy.
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      currentProgress += (targetProgress - currentProgress) * (1 - Math.pow(1 - 0.09, delta * 60));
      const p = currentProgress;
      const wash = smoothstep(FINALE.bloom[0], FINALE.bloom[1], p);

      samplePath(p, position, lookTarget);
      world.camera.position.set(
        position.x + Math.sin(p * Math.PI * 2.6) * 0.25 + pointerX,
        position.y + Math.sin(p * Math.PI * 1.9) * 0.15 - pointerY,
        position.z,
      );
      world.camera.lookAt(lookTarget);
      // Roll must follow lookAt — lookAt rewrites the rotation wholesale.
      world.camera.rotateZ(Math.sin(p * Math.PI * 4) * 0.025);

      frame.elapsed += delta;
      frame.delta = delta;
      frame.p = p;
      frame.wash = wash;
      frame.pointerX = pointerX;
      frame.pointerY = pointerY;
      const alphas: number[] = [];
      for (const { act, window: key } of world.acts) {
        const alpha = windowAlpha(GROUP_WINDOWS[key], p);
        alphas.push(alpha);
        act.group.visible = alpha > 0.002;
        if (!act.group.visible) continue;
        frame.alpha = alpha;
        act.update(frame);
      }

      world.dust.position.z = (frame.elapsed * 0.8 + p * 10) % 9;
      world.dust.rotation.z = p * 0.08;
      world.pulseLights[0].intensity = (11 + Math.sin(frame.elapsed * 2) * 4) * alphas[0];
      world.pulseLights[1].intensity = 4 + alphas[1] * 16;
      world.pulseLights[2].intensity = (4 + alphas[2] * 18) * (1 - wash);

      world.background.copy(darkBackground).lerp(world.paper, wash * 0.985);
      world.fog.color.copy(world.background);
      world.fog.density = FOG_DENSITY - wash * 0.013;
      world.fogUniforms.uFogDensity.value = world.fog.density;
      world.renderer.toneMappingExposure = 1.15 + wash * 1.45;
      // Bloom on a bright plate would wash the whole frame out, so it retires
      // as the scene brightens.
      if (world.bloom) world.bloom.strength = BLOOM_STRENGTH * (1 - wash);
      if (world.composer) world.composer.render(delta);
      else world.renderer.render(world.scene, world.camera);

      // Announce readiness only once a frame has actually landed, so the CSS
      // fallback never unmounts onto an unpainted canvas.
      if (!readyFired) {
        readyFired = true;
        onReady();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      unsubscribe();
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
      world.resources.dispose();
      world.composer?.dispose();
      world.bloom?.dispose();
      world.scene.clear();
      world.renderer.dispose();
      // forceContextLoss on an already-lost context throws in some drivers.
      if (!contextLost) world.renderer.forceContextLoss();
    };
  }, [onReady, onUnavailable, progress]);

  return <canvas ref={canvasRef} className="cinematic-canvas" aria-hidden="true" />;
}
