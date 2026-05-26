import * as THREE from "three";
import {
  useRef, useMemo, useState, useEffect, memo,
} from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider, Physics, RigidBody,
  CylinderCollider, RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechPopup.css";

/* ── static data ─────────────────────────────────────────── */
const imageUrls = [
  "/images/php.png",         "/images/laravel.png",
  "/images/codeigniter.png", "/images/javascript.webp",
  "/images/jquery.png",      "/images/vuejs.png",
  "/images/html5.png",       "/images/css3.png",
  "/images/bootstrap.png",   "/images/tailwind.png",
  "/images/mysql.webp",      "/images/mongo.png",
  "/images/postgresql.png",  "/images/firebase.png",
  "/images/sqlite.png",      "/images/docker.png",
  "/images/redis.png",       "/images/git.png",
  "/images/github.png",      "/images/nginx.png",
  "/images/aws.png",         "/images/digitalocean.png",
  "/images/cursor.png",      "/images/claude.png",
  "/images/antigravity.png",
];

const techNames = [
  "PHP","Laravel","CodeIgniter","JavaScript","jQuery",
  "Vue.js","HTML5","CSS3","Bootstrap","Tailwind CSS",
  "MySQL","MongoDB","PostgreSQL","Firebase","SQLite",
  "Docker","Redis","Git","GitHub","Nginx",
  "AWS","DigitalOcean","Cursor","Claude","Antigravity",
];

const techCategories = [
  "Language","Framework","Framework","Language","Library",
  "Framework","Markup","Styling","UI Library","Styling",
  "Database","Database","Database","Database","Database",
  "DevOps","Caching","Version Control","Version Control","Web Server",
  "Cloud","Cloud","AI IDE","AI Assistant","🚀",
];

/* ── textures (module-level, created once) ─────────────────── */
function createLogoTexture(url: string, pad = 84): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const img = new Image();
  img.onload = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    const s = size - pad * 2;
    ctx.drawImage(img, pad, pad, s, s);
    tex.needsUpdate = true;
  };
  img.src = url;
  return tex;
}

// MongoDB gets smaller padding (bigger logo) and a high-res source
const textures = imageUrls.map((url) =>
  url.includes("mongo") ? createLogoTexture(url, 62) : createLogoTexture(url)
);
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const scaleOptions = [
  1, 0.85, 0.9, 1, 0.8, 0.95, 0.75, 0.9, 1, 0.8,
  0.95, 1, 0.85, 0.75, 0.9, 1, 0.85, 0.8, 0.9, 0.95, 1, 0.75,
  0.9, 1, 0.85,
];

const r = THREE.MathUtils.randFloatSpread;

// Pre-compute positions ONCE — never recalculated on re-render
// x/y spread wide, z kept shallow so balls stay visible and don't hide behind each other
const spheres = imageUrls.map((_, i) => ({
  scale: scaleOptions[i] ?? 0.9,
  textureIndex: i,
  initPos: [r(28), r(22) - 25, r(5)] as [number, number, number],
}));

/* ── SphereGeo ───────────────────────────────────────────── */
type SphereProps = {
  scale: number;
  textureIndex: number;
  initPos: [number, number, number];
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
  isSelected: boolean;
  onSelectRef: React.MutableRefObject<(i: number) => void>;
};

function SphereGeo({
  scale,
  textureIndex,
  initPos,
  material,
  isActive,
  isSelected,
  onSelectRef,
}: SphereProps) {
  const api  = useRef<RapierRigidBody>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_s, delta) => {
    if (!api.current || !mesh.current) return;
    const d = Math.min(0.1, delta);

    if (isSelected) {
      /* lock ball to front-center of camera */
      api.current.setTranslation({ x: 0, y: 0, z: 5 }, true);
      api.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      api.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      /* reset body to identity so mesh local rotation = world rotation */
      api.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      /* rotate mesh: logo lives at u=0.5 → +X face; camera is at +Z
         so rotate -90° around Y to bring +X → +Z (logo faces camera) */
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, 0, 0.08);
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, -Math.PI / 2, 0.08);
      mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, 0, 0.08);
      /* scale up smoothly */
      mesh.current.scale.setScalar(
        THREE.MathUtils.lerp(mesh.current.scale.x, scale * 1.5, 0.1)
      );
    } else {
      /* scale back down */
      mesh.current.scale.setScalar(
        THREE.MathUtils.lerp(mesh.current.scale.x, scale, 0.1)
      );
      /* normal centripetal impulse */
      if (isActive) {
        const t = api.current.translation();
        api.current.applyImpulse(
          new THREE.Vector3(t.x, t.y, t.z)
            .normalize()
            .multiply(new THREE.Vector3(
              -50 * d * scale,
              -150 * d * scale,
              -50 * d * scale
            )),
          true
        );
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectRef.current(isSelected ? -1 : textureIndex);
  };

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={initPos}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        ref={mesh}
        castShadow receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
        onClick={handleClick}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "auto"; }}
      />
    </RigidBody>
  );
}

/* ── Pointer ─────────────────────────────────────────────── */
function Pointer({ isActive }: { isActive: boolean }) {
  const ref = useRef<RapierRigidBody>(null);
  const vec = useRef(new THREE.Vector3());
  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    ref.current?.setNextKinematicTranslation(
      vec.current.lerp(
        new THREE.Vector3(
          (pointer.x * viewport.width) / 2,
          (pointer.y * viewport.height) / 2,
          0
        ),
        0.2
      )
    );
  });
  return (
    <RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

/* ── TechCanvas — memoised so Physics never remounts ─────── */
interface TechCanvasProps {
  isActive: boolean;
  selectedIndex: number | null;
  materials: THREE.MeshPhysicalMaterial[];
  onSelectRef: React.MutableRefObject<(i: number) => void>;
}

const TechCanvas = memo(function TechCanvas({
  isActive, selectedIndex, materials, onSelectRef,
}: TechCanvasProps) {


  return (
    <Canvas
      shadows
      gl={{ alpha: true, stencil: false, antialias: true }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
      onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
      className="tech-canvas"
      /* click empty space → deselect */
      onPointerMissed={() => {
        if (selectedIndex !== null) onSelectRef.current(-1);
      }}
    >
      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 25]} penumbra={1} angle={0.2} color="white"
        castShadow shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[0, 5, -4]} intensity={2} />

      <Physics gravity={[0, 0, 0]}>
        {/* disable cursor ball while a ball is front-stage */}
        <Pointer isActive={isActive && selectedIndex === null} />
        {spheres.map((props, i) => (
          <SphereGeo
            key={i}
            {...props}
            material={materials[props.textureIndex]}
            isActive={isActive}
            isSelected={selectedIndex === i}
            onSelectRef={onSelectRef}
          />
        ))}
      </Physics>

      {/* Name label floats below the selected ball */}
      {selectedIndex !== null && (
        <Html position={[0, -(scaleOptions[selectedIndex] * 1.5 + 1.2), 5]} center>
          <div className="ball-label">
            <span className="ball-label-name">{techNames[selectedIndex]}</span>
            <span className="ball-label-cat">{techCategories[selectedIndex]}</span>
          </div>
        </Html>
      )}

      <Environment
        files="/models/char_enviorment.hdr"
        environmentIntensity={0.5}
        environmentRotation={[0, 4, 2]}
      />
      <EffectComposer enableNormalPass={false}>
        <N8AO color="#0d0014" aoRadius={2} intensity={1.15} />
      </EffectComposer>
    </Canvas>
  );
});

/* ── TechStack (root) ────────────────────────────────────── */
const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  /* stable ref so TechCanvas never gets a new function identity */
  const justOpenedRef = useRef(false);
  const onSelectRef = useRef<(i: number) => void>((i) => {
    justOpenedRef.current = true;
    setSelected(i === -1 ? null : i);
    requestAnimationFrame(() => { justOpenedRef.current = false; });
  });

  const materials = useMemo(
    () => textures.map(
      (texture) => new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.0,
        roughness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      })
    ),
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document.getElementById("work")!.getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((el) => {
      (el as HTMLAnchorElement).addEventListener("click", () => {
        const iv = setInterval(handleScroll, 10);
        setTimeout(() => clearInterval(iv), 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="techstack">
      <h2>My Techstack</h2>
      <TechCanvas
        isActive={isActive}
        selectedIndex={selected}
        materials={materials}
        onSelectRef={onSelectRef}
      />
    </div>
  );
};

export default TechStack;
