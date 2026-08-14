import type { Mesh } from "three"
import { useRef, useState } from "react"
import { useFrame, ThreeElements } from "@react-three/fiber"

export function Box(props: ThreeElements["mesh"]) {
    const meshRef = useRef<Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    useFrame((state, delta) => {
        const mouseX = state.pointer.x
        const mouseY = state.pointer.y

        // Gentle continuous rotation
        meshRef.current.rotation.x += delta * 0.25

        // Mouse-following tilt
        const targetY = mouseX * 0.6
        const targetZ = -mouseY * 0.4

        meshRef.current.rotation.y +=
            (targetY - meshRef.current.rotation.y) * 0.06

        meshRef.current.rotation.z +=
            (targetZ - meshRef.current.rotation.z) * 0.06

        // Gentle floating movement
        meshRef.current.position.y =
            props.position instanceof Array
                ? props.position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.08
                : Math.sin(state.clock.elapsedTime * 1.5) * 0.08
    })

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : hovered ? 1.08 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={hovered ? "#C84B8A" : "#8E356B"}
                roughness={0.25}
                metalness={0.35}
            />
        </mesh>
    )
}