import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const globalPointer = { x: 0, y: 0 };

function HelmetModel() {
  const { scene } = useGLTF("/models/helmet.glb");
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!innerRef.current) return;
    innerRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(innerRef.current);
    const center = box.getCenter(new THREE.Vector3());

    innerRef.current.position.x -= center.x;
    innerRef.current.position.y -= center.y;
    innerRef.current.position.z -= center.z;

    // Снижаем отражения непосредственно на материалах шлема
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh).material as any;
        if (material) {
          // 1.envMapIntensity гасит яркость отражений карты окружения (дефолт: 1.0)
          if (material.envMapIntensity !== undefined) material.envMapIntensity = 0.15;
          
          // 2. roughness делает металл более матовым, размывая четкие отражения (0.0 - зеркало, 1.0 - мат)
          if (material.roughness !== undefined) material.roughness = 0.45;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = globalPointer.x * 0.6;
    const targetX = -globalPointer.y * 0.3;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef} scale={0.8}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export function HelmetScene() {
  useEffect(() => {
    function handleGlobalMove(e: MouseEvent) {
      globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalPointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("mousemove", handleGlobalMove);
    return () => window.removeEventListener("mousemove", handleGlobalMove);
  }, []);

  return (
    <div className="relative w-[280px] h-[380px] sm:w-[450px] sm:h-[480px]">
      <div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(61,111,196,0.18) 0%, transparent 70%)",
          transform: "scale(1.4)",
        }}
      />
      <svg className="absolute inset-0 -z-10 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(61,111,196,0.25)" strokeWidth="0.3" strokeDasharray="2,4" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(95, 136, 216, 0.97)" strokeWidth="0.2" strokeDasharray="1,3" />
      </svg>

      <Canvas camera={{ position: [0, 0, 4.5], fov: 35 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.12} />
          <directionalLight position={[2, 3, 4]} intensity={0.35} color="#fb8721" />
          <pointLight position={[-2, 1, 2]} intensity={0.8} color="#fd8c1a" />

          <HelmetModel />

          <Environment preset="city" environmentIntensity={0.45} />
          <ContactShadows position={[0, -1.1, 0]} opacity={0.6} scale={4} blur={2.2} far={2} />

          <Sparkles count={50} scale={4} size={2} speed={0.3} color="#d9831a" opacity={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/helmet.glb");