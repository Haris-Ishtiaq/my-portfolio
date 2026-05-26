import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // ── Key Light ──────────────────────────────────────────────────────────
  // Warm studio key light from upper-right front — main illumination
  const keyLight = new THREE.DirectionalLight(0xfff4e0, 0); // warm white ~3200K
  keyLight.position.set(3, 4.5, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 60;
  keyLight.shadow.bias = -0.0003;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  // ── Fill Light ─────────────────────────────────────────────────────────
  // Soft cool fill from the left — lifts shadows, adds depth
  const fillLight = new THREE.DirectionalLight(0xc8deff, 0); // soft blue-white
  fillLight.position.set(-4, 1.5, 2);
  fillLight.castShadow = false;
  scene.add(fillLight);

  // ── Rim / Hair Light ───────────────────────────────────────────────────
  // Warm backlight — separates character from background, adds cartoon pop
  const rimLight = new THREE.DirectionalLight(0xffd090, 0); // warm golden rim
  rimLight.position.set(0.5, 2, -4);
  rimLight.castShadow = false;
  scene.add(rimLight);

  // ── Screen Glow ────────────────────────────────────────────────────────
  // Blue-white point light driven by the screen mesh opacity
  const pointLight = new THREE.PointLight(0x5599ff, 0, 100, 2);
  pointLight.position.set(0, 12.5, 3.5);
  pointLight.castShadow = false;
  scene.add(pointLight);

  // ── Ambient base ───────────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0x252535, 1.0);
  scene.add(ambientLight);

  // ── HDR Environment ────────────────────────────────────────────────────
  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr?v=2", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  // Driven every frame by screen mesh emissive intensity
  function setPointLight(screenLight: any) {
    if (screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 18;
    } else {
      pointLight.intensity = 0;
    }
  }

  // Animate all lights on with GSAP after loading
  const duration = 2.2;
  const ease = "power2.inOut";

  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.55,
      duration,
      ease,
    });
    gsap.to(keyLight, {
      intensity: 2.8,
      duration,
      ease,
    });
    gsap.to(fillLight, {
      intensity: 0.9,
      duration,
      ease,
    });
    gsap.to(rimLight, {
      intensity: 1.4,
      duration,
      ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
