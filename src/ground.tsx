import { ThreeElements } from "@react-three/fiber"

export function Ground(props: ThreeElements["mesh"]) {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            {...props}
        >
            <circleGeometry args={[3.5, 64]} />
            <meshStandardMaterial
                color="#E8E0D8"
                roughness={0.9}
            />
        </mesh>
    )
}