import { ThreeElements } from "@react-three/fiber"

export function Rock(props: ThreeElements["mesh"]) {
    return (
        <mesh {...props} castShadow>
            <dodecahedronGeometry args={[0.25, 1]} />
            <meshStandardMaterial
                color="#B8ADA2"
                roughness={0.9}
            />
        </mesh>
    )
}