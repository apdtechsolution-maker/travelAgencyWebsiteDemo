"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, Line, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { DESTINATIONS, ORIGIN, fmtINR, getPkg, type Destination } from "@/lib/data";

const R = 1.46;

/** Matches THREE.SphereGeometry UV (equirectangular, lon −180 at u = 0). */
function latLon(lat: number, lon: number, radius: number) {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const theta = ((90 - lat) / 180) * Math.PI;
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const atmVert = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmFrag = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float rim = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.2);
    gl_FragColor = vec4(0.45, 0.68, 1.0, 1.0) * rim * 1.15;
  }
`;

function Starfield() {
  const positions = useMemo(() => {
    const count = 900;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4efe4" size={0.018} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Lights({ night }: { night: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-2.4 * dt);
    target.set(night ? -2.5 : 5.2, night ? 0.4 : 2.4, night ? -5 : 3.2);
    sun.current?.position.lerp(target, k);
    if (sun.current) sun.current.intensity += ((night ? 0.2 : 1.65) - sun.current.intensity) * k;
    if (amb.current) amb.current.intensity += ((night ? 0.05 : 0.55) - amb.current.intensity) * k;
  });
  return (
    <>
      <ambientLight ref={amb} intensity={0.55} />
      <directionalLight ref={sun} position={[5.2, 2.4, 3.2]} intensity={1.65} color="#fff6e8" />
      <directionalLight position={[-5, -1, -2]} intensity={0.16} color="#b9d4ff" />
    </>
  );
}

function Earth({ night }: { night: boolean }) {
  const [day, spec, normal, nightMap, clouds] = useTexture([
    "/globe/earth-day.jpg",
    "/globe/earth-spec.jpg",
    "/globe/earth-normal.jpg",
    "/globe/earth-night.png",
    "/globe/earth-clouds.png",
  ]);
  const gl = useThree((s) => s.gl);
  const cloud = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshPhongMaterial>(null);

  useLayoutEffect(() => {
    const max = gl.capabilities.getMaxAnisotropy();
    for (const t of [day, spec, normal, nightMap, clouds]) {
      t.anisotropy = max;
      t.needsUpdate = true;
    }
    day.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    spec.colorSpace = THREE.NoColorSpace;
    normal.colorSpace = THREE.NoColorSpace;
    clouds.colorSpace = THREE.NoColorSpace;
  }, [gl, day, spec, normal, nightMap, clouds]);

  useEffect(() => {
    const m = mat.current;
    if (!m) return;
    if (night) {
      m.map = nightMap;
      m.normalMap = null;
      m.specularMap = null;
      m.emissiveMap = nightMap;
      m.emissive = new THREE.Color("#ffe2b0");
      m.emissiveIntensity = 1.25;
      m.specular = new THREE.Color("#1a1a1a");
      m.shininess = 4;
    } else {
      m.map = day;
      m.normalMap = normal;
      m.normalScale = new THREE.Vector2(0.45, 0.45);
      m.specularMap = spec;
      m.emissiveMap = null;
      m.emissive = new THREE.Color("#000000");
      m.emissiveIntensity = 0;
      m.specular = new THREE.Color("#3a3a3a");
      m.shininess = 14;
    }
    m.needsUpdate = true;
  }, [night, day, spec, normal, nightMap]);

  useFrame((_, dt) => {
    if (cloud.current) cloud.current.rotation.y += dt * 0.012;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[R, 96, 96]} />
        <meshPhongMaterial ref={mat} map={day} specularMap={spec} normalMap={normal} specular="#3a3a3a" shininess={14} />
      </mesh>
      <mesh ref={cloud} scale={1.014}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshPhongMaterial map={clouds} transparent opacity={night ? 0.18 : 0.38} depthWrite={false} />
      </mesh>
      <mesh scale={1.09}>
        <sphereGeometry args={[R, 64, 64]} />
        <shaderMaterial
          vertexShader={atmVert}
          fragmentShader={atmFrag}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Beacon({
  dest,
  active,
  onSelect,
}: {
  dest: Destination;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const pos = useMemo(() => latLon(dest.lat, dest.lon, R + 0.012), [dest]);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  const label = useRef<HTMLDivElement>(null);
  const wp = useMemo(() => new THREE.Vector3(), []);
  const cp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    if (!label.current) return;
    wp.copy(pos).normalize();
    cp.copy(camera.position).normalize();
    const o = THREE.MathUtils.clamp(wp.dot(cp) * 3 - 0.4, 0, 1);
    label.current.style.opacity = String(o);
  });

  return (
    <group position={pos} quaternion={quat}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(dest.id);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {active && (
        <mesh position={[0, 0, 0.07]}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.14, 8]} />
          <meshBasicMaterial color="#f4efe6" />
        </mesh>
      )}
      <mesh position={[0, 0, active ? 0.14 : 0.02]}>
        <sphereGeometry args={[active ? 0.028 : 0.018, 16, 16]} />
        <meshBasicMaterial color={active ? "#f4efe6" : "#e6c98a"} />
      </mesh>
      {active && (
        <Html position={[0, 0, 0.22]} center distanceFactor={6.5} zIndexRange={[24, 0]} style={{ pointerEvents: "none" }}>
          <div ref={label} className="whitespace-nowrap bg-[#f4efe6] px-2.5 py-1.5 text-left text-[#1a1714] shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            <p className="text-[12px] font-medium leading-none">{dest.short}</p>
            <p className="mt-1 font-mono text-[10px] text-[#8f4e30]">{fmtINR(getPkg(dest.id).price)}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Hub() {
  const pos = useMemo(() => latLon(ORIGIN.lat, ORIGIN.lon, R + 0.012), []);
  return (
    <mesh position={pos}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color="#e6c98a" />
    </mesh>
  );
}

function Jet() {
  return (
    <group scale={0.72}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.012, 0.09, 4, 10]} />
        <meshStandardMaterial color="#f7f4ee" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.062]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.012, 0.028, 10]} />
        <meshStandardMaterial color="#d7d2c8" metalness={0.6} roughness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.042, 0, -0.006]} rotation={[0, s * 0.5, 0]}>
          <boxGeometry args={[0.08, 0.003, 0.028]} />
          <meshStandardMaterial color="#f7f4ee" metalness={0.4} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.016, -0.048]}>
        <boxGeometry args={[0.003, 0.028, 0.02]} />
        <meshStandardMaterial color="#e6c98a" />
      </mesh>
    </group>
  );
}

function FlightRoute({ dest }: { dest: Destination }) {
  const { points, curve } = useMemo(() => {
    const s = latLon(ORIGIN.lat, ORIGIN.lon, R + 0.03);
    const e = latLon(dest.lat, dest.lon, R + 0.03);
    const dist = s.distanceTo(e);
    const m = s
      .clone()
      .add(e)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(R + 0.1 + dist * 0.16);
    const c = new THREE.QuadraticBezierCurve3(s, m, e);
    return { points: c.getPoints(80), curve: c };
  }, [dest]);

  const jet = useRef<THREE.Group>(null);
  const tmp = useMemo(
    () => ({ p: new THREE.Vector3(), t: new THREE.Vector3(), x: new THREE.Vector3(), y: new THREE.Vector3(), m: new THREE.Matrix4() }),
    [],
  );

  useFrame(({ clock }) => {
    if (!jet.current) return;
    const u = (clock.elapsedTime * 0.08) % 1;
    curve.getPoint(u, tmp.p);
    curve.getTangent(u, tmp.t).normalize();
    tmp.y.copy(tmp.p).normalize();
    tmp.x.crossVectors(tmp.y, tmp.t).normalize();
    tmp.y.crossVectors(tmp.t, tmp.x).normalize();
    tmp.m.makeBasis(tmp.x, tmp.y, tmp.t);
    jet.current.position.copy(tmp.p);
    jet.current.quaternion.setFromRotationMatrix(tmp.m);
  });

  return (
    <group>
      <Line points={points} color="#1a1714" lineWidth={5} transparent opacity={0.28} />
      <Line points={points} color="#f0d48a" lineWidth={1.5} />
      <group ref={jet}>
        <Jet />
      </group>
    </group>
  );
}

function Rig({ activeId, onSelect, night }: { activeId: string; onSelect: (id: string) => void; night: boolean }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const camera = useThree((s) => s.camera);
  const active = DESTINATIONS.find((d) => d.id === activeId) ?? DESTINATIONS[0];

  useEffect(() => {
    const p = latLon(active.lat, active.lon, 1);
    const a = Math.atan2(p.x, p.z);
    const camAz = Math.atan2(camera.position.x, camera.position.z);
    const cur = group.current?.rotation.y ?? 0;
    let ty = camAz - a;
    const d = THREE.MathUtils.euclideanModulo(ty - cur + Math.PI, Math.PI * 2) - Math.PI;
    ty = cur + d;
    target.current = { x: THREE.MathUtils.degToRad(active.lat) * 0.22, y: ty };
  }, [active, camera]);

  useFrame((_, dt) => {
    if (!group.current) return;
    const k = 1 - Math.exp(-2.6 * dt);
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * k;
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * k;
  });

  return (
    <group ref={group}>
      <Earth night={night} />
      <Hub />
      {DESTINATIONS.map((d) => (
        <Beacon key={d.id} dest={d} active={d.id === activeId} onSelect={onSelect} />
      ))}
      <FlightRoute key={active.id} dest={active} />
    </group>
  );
}

function Fit({ children }: { children: React.ReactNode }) {
  const width = useThree((s) => s.viewport.width);
  const s = Math.min(1, width / 3.35);
  return <group scale={s}>{children}</group>;
}

function TouchFix() {
  const el = useThree((s) => s.gl.domElement);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      el.style.touchAction = "pan-y";
    });
    return () => cancelAnimationFrame(id);
  }, [el]);
  return null;
}

export default function GlobeScene({
  activeId,
  onSelect,
  night,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  night: boolean;
}) {
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    setAuto(false);
    const t = setTimeout(() => setAuto(true), 8000);
    return () => clearTimeout(t);
  }, [activeId]);

  return (
    <Canvas
      camera={{ position: [0, 0.32, 5.55], fov: 35 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
    >
      <color attach="background" args={[night ? "#07090c" : "#0c1218"]} />
      <Lights night={night} />
      <Starfield />
      <Suspense fallback={null}>
        <Fit>
          <Float speed={0.7} rotationIntensity={0.04} floatIntensity={0.12}>
            <Rig activeId={activeId} onSelect={onSelect} night={night} />
          </Float>
        </Fit>
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={auto}
        autoRotateSpeed={0.22}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.42}
        onStart={() => setAuto(false)}
        onEnd={() => {
          window.setTimeout(() => setAuto(true), 5000);
        }}
      />
      <TouchFix />
    </Canvas>
  );
}
