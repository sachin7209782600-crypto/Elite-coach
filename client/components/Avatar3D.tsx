import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Avatar3DProps {
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
}

const PERSONA_CONFIG: Record<string, AvatarConfig> = {
  "mei-ling": {
    skinColor: "#f4c4a0",
    hairColor: "#2c2c2c",
    eyeColor: "#3d3d3d",
    clothesColor: "#4a90e2",
  },
  zara: {
    skinColor: "#e8b4a0",
    hairColor: "#d4445f",
    eyeColor: "#8b4a6a",
    clothesColor: "#d946ef",
  },
  elena: {
    skinColor: "#f5d5a8",
    hairColor: "#8b6f47",
    eyeColor: "#6b4423",
    clothesColor: "#10b981",
  },
  sia: {
    skinColor: "#f9ddbf",
    hairColor: "#e8a745",
    eyeColor: "#c27803",
    clothesColor: "#f59e0b",
  },
  valkyrie: {
    skinColor: "#f0d5c3",
    hairColor: "#d4af37",
    eyeColor: "#4a90e2",
    clothesColor: "#ef4444",
  },
};

export function Avatar3D({
  personaId,
  personaName,
  isListening = false,
  isSpeaking = false,
}: Avatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const avatarRef = useRef<THREE.Group | null>(null);
  const jawRef = useRef<THREE.Bone | null>(null);
  const blinkerRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 100, 1000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 1.5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xff69b4, 0.3);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);

    // Create avatar
    const config = PERSONA_CONFIG[personaId] || PERSONA_CONFIG["mei-ling"];
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: config.skinColor,
      roughness: 0.4,
      metalness: 0.1,
    });
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.castShadow = true;
    head.receiveShadow = true;
    head.position.y = 0.4;
    avatarGroup.add(head);

    // Hair
    const hairGeometry = new THREE.SphereGeometry(0.37, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: config.hairColor,
      roughness: 0.6,
      metalness: 0,
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.castShadow = true;
    hair.receiveShadow = true;
    hair.position.y = 0.65;
    avatarGroup.add(hair);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: config.eyeColor,
      roughness: 0.3,
      metalness: 0.2,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.12, 0.6, 0.3);
    leftEye.castShadow = true;
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.12, 0.6, 0.3);
    rightEye.castShadow = true;
    head.add(rightEye);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.2,
      metalness: 0.3,
    });

    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.z = 0.06;
    leftEye.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.z = 0.06;
    rightEye.add(rightPupil);

    // Eyelids for blinking
    const eyelidGroup = new THREE.Group();
    const eyelidGeometry = new THREE.SphereGeometry(0.115, 32, 16);
    const eyelidMaterial = new THREE.MeshStandardMaterial({
      color: config.skinColor,
      roughness: 0.4,
      metalness: 0.1,
    });

    const leftEyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
    leftEyelid.position.set(-0.12, 0.6, 0.31);
    eyelidGroup.add(leftEyelid);

    const rightEyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
    rightEyelid.position.set(0.12, 0.6, 0.31);
    eyelidGroup.add(rightEyelid);

    head.add(eyelidGroup);
    blinkerRef.current = eyelidGroup;

    // Nose
    const noseGeometry = new THREE.ConeGeometry(0.05, 0.15, 8);
    const noseMaterial = new THREE.MeshStandardMaterial({
      color: config.skinColor,
      roughness: 0.5,
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0.45, 0.3);
    nose.castShadow = true;
    head.add(nose);

    // Mouth/Jaw
    const jawGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.15);
    const jawMaterial = new THREE.MeshStandardMaterial({
      color: "#c89b7b",
      roughness: 0.5,
    });
    const jaw = new THREE.Mesh(jawGeometry, jawMaterial);
    jaw.position.set(0, 0.2, 0.28);
    jaw.castShadow = true;
    head.add(jaw);
    jawRef.current = jaw as any;

    // Neck
    const neckGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.2, 16);
    const neckMaterial = new THREE.MeshStandardMaterial({
      color: config.skinColor,
      roughness: 0.4,
      metalness: 0.1,
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 0.05;
    neck.castShadow = true;
    neck.receiveShadow = true;
    avatarGroup.add(neck);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.25);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: config.clothesColor,
      roughness: 0.5,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -0.15;
    body.castShadow = true;
    body.receiveShadow = true;
    avatarGroup.add(body);

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    avatarRef.current = avatarGroup;

    // Animation loop
    let blinkTime = Math.random() * 3 + 2;
    let mouthOpen = 0;
    let jawRotation = 0;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Blinking
      blinkTime -= 0.016;
      if (blinkTime <= 0) {
        blinkTime = Math.random() * 3 + 2;
      }

      const blinkAmount = Math.max(0, Math.sin((2 - blinkTime) * Math.PI));
      if (eyelidGroup) {
        eyelidGroup.children.forEach((eyelid) => {
          eyelid.scale.y = 1 - blinkAmount;
        });
      }

      // Mouth movement
      if (isSpeaking) {
        mouthOpen = Math.max(
          0.05,
          0.15 + Math.sin(Date.now() * 0.005) * 0.1
        );
        jawRotation = mouthOpen * 0.5;
      } else {
        mouthOpen *= 0.9;
        jawRotation *= 0.9;
      }

      if (jaw) {
        jaw.rotation.z = jawRotation;
        jaw.scale.y = 1 + mouthOpen;
      }

      // Listening animation (head tilt)
      if (isListening) {
        avatarGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
        avatarGroup.rotation.x = Math.cos(Date.now() * 0.0008) * 0.03;
      } else {
        avatarGroup.rotation.z *= 0.95;
        avatarGroup.rotation.x *= 0.95;
      }

      // Slight breathing animation
      const breathe = Math.sin(Date.now() * 0.001) * 0.02;
      body.position.y = -0.15 + breathe;
      head.position.y = 0.4 + breathe * 0.5;
      neck.position.y = 0.05 + breathe * 0.5;

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
      className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
    >
      {/* Persona name overlay */}
      <div className="absolute top-6 left-6 z-10 text-white">
        <p className="text-sm font-semibold opacity-70">{personaName}</p>
        <div className="flex gap-1 mt-1">
          {isListening && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
          {isSpeaking && (
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Status text overlay */}
      {isListening && (
        <div className="absolute bottom-6 left-6 z-10 text-white text-sm">
          <p className="opacity-70">🎤 Listening...</p>
        </div>
      )}
      {isSpeaking && (
        <div className="absolute bottom-6 left-6 z-10 text-white text-sm">
          <p className="opacity-70">💬 Speaking...</p>
        </div>
      )}
    </div>
  );
}
