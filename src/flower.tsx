import { useRef } from "react"
import { useFrame, ThreeElements } from "@react-three/fiber"
import * as THREE from "three"

export function Flower(props: ThreeElements["group"]) {
    const flowerRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        const mouseX = state.pointer.x
        const mouseY = state.pointer.y

        // Gentle natural movement
        const targetZ = -mouseX * 0.25
        const targetX = mouseY * 0.15

        flowerRef.current.rotation.z +=
            (targetZ - flowerRef.current.rotation.z) * 0.04

        flowerRef.current.rotation.x +=
            (targetX - flowerRef.current.rotation.x) * 0.04

        // Very subtle floating motion
        flowerRef.current.position.y =
            Math.sin(state.clock.elapsedTime * 1.2) * 0.05
    })

    return (
        <group ref={flowerRef} {...props}>

            {/* Stem */}
            <mesh position={[0, -0.8, 0]}>
                <cylinderGeometry args={[0.035, 0.05, 1.6, 12]} />
                <meshStandardMaterial color="#5C7355" />
            </mesh>

            {/* Left leaf */}
            <mesh
                position={[-0.25, -0.65, 0]}
                rotation={[0, 0, -0.5]}
            >
                <sphereGeometry args={[0.25, 16, 8]} />
                <meshStandardMaterial color="#78946D" />
            </mesh>

            {/* Right leaf */}
            <mesh
                position={[0.25, -0.45, 0]}
                rotation={[0, 0, 0.5]}
            >
                <sphereGeometry args={[0.22, 16, 8]} />
                <meshStandardMaterial color="#78946D" />
            </mesh>

            {/* Flower petals */}
            {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i / 5) * Math.PI * 2

                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * 0.32,
                            0.35 + Math.sin(angle) * 0.32,
                            0,
                        ]}
                        rotation={[0, 0, -angle]}
                    >
                        <sphereGeometry args={[0.28, 16, 8]} />
                        <meshStandardMaterial color="#A83D78" />
                    </mesh>
                )
            })}

            {/* Flower center */}
            <mesh position={[0, 0.35, 0.08]}>
                <sphereGeometry args={[0.22, 20, 20]} />
                <meshStandardMaterial
                    color="#D59A3A"
                    roughness={0.5}
                />
            </mesh>

        </group>
    )
}