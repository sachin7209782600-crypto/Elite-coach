import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface RealisticAvatar3DProps {
  personaId: string;
  personaName: string;
  isListening?: boolean;
  isSpeaking?: boolean;
}

interface AvatarConfig {
  skinColor: THREE.ColorRepresentation;
  hairColor: THREE.ColorRepresentation;
  eyeColor: THREE.ColorRepresentation;
  clothesColor: THREE.ColorRepresentation;
  clothesSecondary: THREE.ColorRepresentation;
}

const PERSONA_CONFIG: Record<string, AvatarConfig> = {
  "mei-ling": {
    skinColor: "#f4c4a0",
    hairColor: "#1a1a1a",
    eyeColor: "#5c4033",
    clothesColor: "#4a90e2",
    clothesSecondary: "#ffffff",
  },
  zara: {
    skinColor: "#e8b4a0",
    hairColor: "#c41e3a",
    eyeColor: "#8b3a62",
    clothesColor: "#d946ef",
    clothesSecondary: "#f5f5f5",
  },
  elena: {
    skinColor: "#f5d5a8",
    hairColor: "#8b6f47",
    eyeColor: "#7d5f4e",
    clothesColor: "#10b981",
    clothesSecondary: "#f0f9f8",
  },
  sia: {
    skinColor: "#f9ddbf",
    hairColor: "#d4a574",
    eyeColor: "#c8932f",
    clothesColor: "#f59e0b",
    clothesSecondary: "#fef3c7",
  },
  valkyrie: {
    skinColor: "#f0d5c3",
    hairColor: "#d4af37",
    eyeColor: "#1f4788",
    clothesColor: "#dc2626",
    clothesSecondary: "#1f2937",
  },
};

export function RealisticAvatar3D({
  personaId,
  personaName,
  isListening = false,
  isSpeaking = false,
}: RealisticAvatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const jawRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 100, 1000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    camera.position.y = 0.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(3, 4, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff69b4, 0.25);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);

    // Create realistic avatar
    const config = PERSONA_CONFIG[personaId] || PERSONA_CONFIG["mei-ling"];
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Create skin material
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: config.skinColor,
      roughness: 0.35,
      metalness: 0,
      map: createSkinTexture(),
    });

    // HEAD (more realistic)
    const headGeometry = new THREE.IcosahedronGeometry(0.32, 5);
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.castShadow = true;
    head.receiveShadow = true;
    head.position.y = 0.85;
    avatarGroup.add(head);

    // HAIR (more realistic style)
    const hairGeometry = new THREE.SphereGeometry(0.345, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: config.hairColor,
      roughness: 0.7,
      metalness: 0,
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.castShadow = true;
    hair.receiveShadow = true;
    hair.position.set(0, 1.05, 0);
    hair.scale.set(1, 1.2, 1);
    avatarGroup.add(hair);

    // EYES
    const eyeGeometry = new THREE.SphereGeometry(0.11, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: config.eyeColor,
      roughness: 0.2,
      metalness: 0.3,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.13, 0.95, 0.28);
    leftEye.castShadow = true;
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.13, 0.95, 0.28);
    rightEye.castShadow = true;
    head.add(rightEye);

    // PUPILS
    const pupilGeometry = new THREE.SphereGeometry(0.065, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.1,
      metalness: 0.4,
    });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.z = 0.07;
    leftEye.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.z = 0.07;
    rightEye.add(rightPupil);

    // EYELASHES
    const eyelashMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.8,
    });

    // NOSE
    const noseGeometry = new THREE.ConeGeometry(0.04, 0.12, 8);
    const noseMaterial = new THREE.MeshStandardMaterial({
      color: config.skinColor,
      roughness: 0.5,
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0.88, 0.3);
    nose.castShadow = true;
    head.add(nose);

    // MOUTH/JAW
    const jawGeometry = new THREE.BoxGeometry(0.22, 0.08, 0.12);
    const jawMaterial = new THREE.MeshStandardMaterial({
      color: "#d97b7b",
      roughness: 0.4,
    });
    const jaw = new THREE.Mesh(jawGeometry, jawMaterial);
    jaw.position.set(0, 0.75, 0.28);
    jaw.castShadow = true;
    head.add(jaw);
    jawRef.current = jaw;

    // NECK
    const neckGeometry = new THREE.CylinderGeometry(0.14, 0.18, 0.22, 32);
    const neckMaterial = new THREE.MeshStandardMaterial({
      color: config.skinColor,
      roughness: 0.35,
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 0.54;
    neck.castShadow = true;
    neck.receiveShadow = true;
    avatarGroup.add(neck);

    // TORSO/BODY
    const torsoGeometry = new THREE.CylinderGeometry(0.28, 0.25, 0.5, 32);
    const clothesMaterial = new THREE.MeshStandardMaterial({
      color: config.clothesColor,
      roughness: 0.6,
      metalness: 0.05,
    });
    const torso = new THREE.Mesh(torsoGeometry, clothesMaterial);
    torso.position.y = 0.15;
    torso.castShadow = true;
    torso.receiveShadow = true;
    avatarGroup.add(torso);

    // SHOULDERS/ARMS
    const shoulderGeometry = new THREE.SphereGeometry(0.13, 16, 16);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: config.clothesColor,
      roughness: 0.6,
    });

    const leftShoulder = new THREE.Mesh(shoulderGeometry, armMaterial);
    leftShoulder.position.set(-0.32, 0.35, 0);
    leftShoulder.castShadow = true;
    avatarGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeometry, armMaterial);
    rightShoulder.position.set(0.32, 0.35, 0);
    rightShoulder.castShadow = true;
    avatarGroup.add(rightShoulder);

    // ARMS
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16);
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.38, 0.15, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    avatarGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.38, 0.15, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    avatarGroup.add(rightArm);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    avatarGroupRef.current = avatarGroup;

    // Animation loop
    let blinkTime = Math.random() * 3 + 2;
    let mouthOpen = 0;
    let jawRotation = 0;
    let breathPhase = 0;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Blinking
      blinkTime -= 0.016;
      if (blinkTime <= 0) {
        blinkTime = Math.random() * 4 + 2;
      }

      const blinkAmount = Math.max(0, Math.sin((2 - blinkTime) * Math.PI));
      leftEye.scale.y = 1 - blinkAmount * 0.8;
      rightEye.scale.y = 1 - blinkAmount * 0.8;

      // Speaking mouth animation
      if (isSpeaking) {
        mouthOpen = Math.max(0.06, 0.18 + Math.sin(Date.now() * 0.008) * 0.12);
        jawRotation = mouthOpen * 0.4;
      } else {
        mouthOpen *= 0.92;
        jawRotation *= 0.92;
      }

      if (jaw) {
        jaw.rotation.x = jawRotation;
        jaw.scale.y = 1 + mouthOpen;
      }

      // Listening animation
      if (isListening) {
        avatarGroup.rotation.z = Math.sin(Date.now() * 0.0015) * 0.08;
        avatarGroup.rotation.x = Math.cos(Date.now() * 0.0012) * 0.05;
        head.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      } else {
        avatarGroup.rotation.z *= 0.96;
        avatarGroup.rotation.x *= 0.96;
        head.rotation.y *= 0.96;
      }

      // Breathing animation
      breathPhase += 0.01;
      const breathe = Math.sin(breathPhase * 0.5) * 0.015;
      torso.position.y = 0.15 + breathe;
      neck.position.y = 0.54 + breathe * 0.6;
      head.position.y = 0.85 + breathe * 0.8;

      // Eye movement (looking at camera)
      const lookDirection = Math.sin(Date.now() * 0.0005) * 0.05;
      leftPupil.position.x = lookDirection * 0.02;
      rightPupil.position.x = lookDirection * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      (camera as THREE.PerspectiveCamera).aspect = width / height;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    setIsInitialized(true);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (renderer) {
        containerRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [personaId, isInitialized, isSpeaking, isListening]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
    >
      {/* Status indicators */}
      <div className="absolute top-6 left-6 z-10 text-white">
        <p className="text-sm font-bold opacity-90">{personaName}</p>
        <div className="flex gap-2 mt-2">
          {isListening && (
            <div className="flex items-center gap-1 bg-green-500/30 px-2 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Listening</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-1 bg-primary/30 px-2 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Speaking</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Create procedural skin texture
function createSkinTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // Base skin color
  ctx.fillStyle = "#f4c4a0";
  ctx.fillRect(0, 0, 256, 256);

  // Add subtle freckles/pores
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(200, 150, 100, ${Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
