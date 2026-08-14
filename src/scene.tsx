import { ContactShadows, RoundedBox } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

function createArch() {
    const shape = new THREE.Shape()

    shape.moveTo(-1.15, -1.3)
    shape.lineTo(-1.15, 0.55)

    shape.quadraticCurveTo(-1.15, 1.45, 0, 1.45)

    shape.quadraticCurveTo(1.15, 1.45, 1.15, 0.55)

    shape.lineTo(1.15, -1.3)
    shape.closePath()

    const hole = new THREE.Path()

    hole.moveTo(-0.62, -1.3)
    hole.lineTo(-0.62, 0.45)

    hole.quadraticCurveTo(-0.62, 0.95, 0, 0.95)

    hole.quadraticCurveTo(0.62, 0.95, 0.62, 0.45)

    hole.lineTo(0.62, -1.3)
    hole.closePath()

    shape.holes.push(hole)

    return shape
}

function Vase() {
    const points = useMemo(
        () => [
            new THREE.Vector2(0.18, -0.45),
            new THREE.Vector2(0.3, -0.35),
            new THREE.Vector2(0.38, 0),
            new THREE.Vector2(0.32, 0.35),
            new THREE.Vector2(0.18, 0.48),
        ],
        []
    )

    return (
        <mesh position={[-0.35, -0.2, 0.35]} castShadow>
            <latheGeometry args={[points, 48]} />

            <meshStandardMaterial
                color="#D98F75"
                roughness={0.32}
            />
        </mesh>
    )
}

function Flower() {
    const stem = useRef<THREE.Group>(null!)

    useFrame((state) => {
        if (!stem.current) return

        const target =
            state.pointer.x * 0.12

        stem.current.rotation.z +=
            (target - stem.current.rotation.z) * 0.035
    })

    return (
        <group
            ref={stem}
            position={[-0.35, 0.25, 0.35]}
        >
            {/* STEM */}
            <mesh position={[0, 0.65, 0]}>
                <cylinderGeometry
                    args={[0.025, 0.035, 1.3, 16]}
                />

                <meshStandardMaterial
                    color="#718B63"
                    roughness={0.8}
                />
            </mesh>

            {/* FLOWER PETALS */}
            <group position={[0, 1.32, 0]}>

                {[0, 72, 144, 216, 288].map(
                    (rotation, index) => (
                        <mesh
                            key={index}
                            rotation={[
                                0.15,
                                0,
                                THREE.MathUtils.degToRad(
                                    rotation
                                ),
                            ]}
                        >
                            <sphereGeometry
                                args={[
                                    0.19,
                                    32,
                                    20,
                                ]}
                            />

                            <meshStandardMaterial
                                color="#E59A9D"
                                roughness={0.42}
                            />
                        </mesh>
                    )
                )}

                {/* CENTER */}
                <mesh>
                    <sphereGeometry
                        args={[0.13, 32, 32]}
                    />

                    <meshStandardMaterial
                        color="#D69B57"
                        roughness={0.55}
                    />
                </mesh>

            </group>

            {/* LEAF */}
            <mesh
                position={[0.12, 0.7, 0]}
                rotation={[0, 0, -0.5]}
            >
                <sphereGeometry
                    args={[0.15, 24, 16]}
                />

                <meshStandardMaterial
                    color="#819B70"
                    roughness={0.75}
                />
            </mesh>
        </group>
    )
}

export function Scene() {
    const scene = useRef<THREE.Group>(null!)

    const arch = useMemo(
        () => createArch(),
        []
    )

    useFrame((state) => {
        if (!scene.current) return

        scene.current.rotation.y +=
            (state.pointer.x * 0.035 -
                scene.current.rotation.y) *
            0.035

        scene.current.rotation.x +=
            (-state.pointer.y * 0.015 -
                scene.current.rotation.x) *
            0.035
    })

    return (
        <>
            {/* FLOOR */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1, 0]}
                receiveShadow
            >
                <planeGeometry
                    args={[20, 20]}
                />

                <meshStandardMaterial
                    color="#FFF7F1"
                    roughness={0.88}
                />
            </mesh>

            {/* BACKDROP */}
            <mesh
                position={[0, 1.3, -2.5]}
            >
                <planeGeometry
                    args={[12, 6]}
                />

                <meshStandardMaterial
                    color="#F5E5DC"
                    roughness={1}
                />
            </mesh>

            <group ref={scene}>

                {/* CURTAIN FOLDS */}
                <group
                    position={[-2.05, 0.45, -1.75]}
                >
                    {Array.from({
                        length: 7,
                    }).map((_, i) => (
                        <mesh
                            key={i}
                            position={[
                                i * 0.28,
                                0,
                                Math.sin(i * 0.8) * 0.05,
                            ]}
                        >
                            <cylinderGeometry
                                args={[
                                    0.17,
                                    0.17,
                                    3.0,
                                    32,
                                ]}
                            />

                            <meshStandardMaterial
                                color={
                                    i % 2 === 0
                                        ? "#E2A38E"
                                        : "#E8B09C"
                                }
                                roughness={0.82}
                            />
                        </mesh>
                    ))}
                </group>

                {/* ARCH */}
                <mesh
                    position={[1.35, 0.05, -1.4]}
                    castShadow
                >
                    <extrudeGeometry
                        args={[
                            arch,
                            {
                                depth: 0.32,
                                bevelEnabled: true,
                                bevelThickness: 0.06,
                                bevelSize: 0.05,
                                bevelSegments: 5,
                            },
                        ]}
                    />

                    <meshStandardMaterial
                        color="#D9C0BA"
                        roughness={0.76}
                    />
                </mesh>

                {/* LOW PEDESTAL */}
                <RoundedBox
                    args={[
                        2.9,
                        0.28,
                        1.45,
                    ]}
                    radius={0.12}
                    smoothness={8}
                    position={[
                        -0.1,
                        -0.86,
                        0,
                    ]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color="#F8EEE9"
                        roughness={0.78}
                    />
                </RoundedBox>

                {/* SMALL RISER */}
                <RoundedBox
                    args={[
                        1.15,
                        0.16,
                        0.85,
                    ]}
                    radius={0.08}
                    smoothness={8}
                    position={[
                        -0.35,
                        -0.64,
                        0.1,
                    ]}
                    castShadow
                >
                    <meshStandardMaterial
                        color="#EEDBD3"
                        roughness={0.72}
                    />
                </RoundedBox>

                {/* VASE */}
                <Vase />

                {/* FLOWER */}
                <Flower />

                {/* SMALL SPHERE */}
                <mesh
                    position={[
                        1.15,
                        -0.55,
                        0.35,
                    ]}
                    castShadow
                >
                    <sphereGeometry
                        args={[0.3, 64, 64]}
                    />

                    <meshStandardMaterial
                        color="#D4AAA0"
                        roughness={0.24}
                    />
                </mesh>

            </group>

            {/* CONTACT SHADOW */}
            <ContactShadows
                position={[0, -0.99, 0]}
                opacity={0.3}
                scale={5}
                blur={2.8}
                far={2.5}
            />
        </>
    )
}