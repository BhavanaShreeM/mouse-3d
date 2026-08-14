import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { TextureLoader } from "three"
import * as THREE from "three"
import { useRef } from "react"

function Landscape() {
  const texture = useLoader(TextureLoader, "/landscape.jpg")

  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  // Actual cursor position
  const targetMouse = useRef(
    new THREE.Vector2(0.5, 0.5)
  )

  // Smoothed cursor position
  const smoothMouse = useRef(
    new THREE.Vector2(0.5, 0.5)
  )

  // Cursor movement velocity
  const velocity = useRef(
    new THREE.Vector2(0, 0)
  )

  // Previous cursor position
  const previousMouse = useRef(
    new THREE.Vector2(0.5, 0.5)
  )

  const { viewport } = useThree()

  const image = texture.image as HTMLImageElement

  const imageAspect =
    image.width / image.height

  const screenAspect =
    viewport.width / viewport.height

  let width = viewport.width
  let height = viewport.height

  if (imageAspect > screenAspect) {
    width =
      viewport.height *
      imageAspect
  } else {
    height =
      viewport.width /
      imageAspect
  }

  useFrame(() => {
    if (!materialRef.current) return

    // -----------------------------------------
    // SMOOTH CURSOR
    // -----------------------------------------

    smoothMouse.current.lerp(
      targetMouse.current,
      0.12
    )

    // -----------------------------------------
    // CURSOR VELOCITY
    // -----------------------------------------

    const dx =
      smoothMouse.current.x -
      previousMouse.current.x

    const dy =
      smoothMouse.current.y -
      previousMouse.current.y

    const currentVelocity =
      new THREE.Vector2(
        dx,
        dy
      )

    // Smooth the velocity
    velocity.current.lerp(
      currentVelocity,
      0.35
    )

    // Send cursor position to shader
    materialRef.current.uniforms.uMouse.value.copy(
      smoothMouse.current
    )

    // Send cursor velocity to shader
    materialRef.current.uniforms.uVelocity.value.copy(
      velocity.current
    )

    // Remember current position
    previousMouse.current.copy(
      smoothMouse.current
    )
  })

  return (
    <mesh
      scale={[width, height, 1]}
      onPointerMove={(event) => {
        if (event.uv) {
          targetMouse.current.copy(
            event.uv
          )
        }
      }}
    >

      <planeGeometry args={[1, 1]} />

      <shaderMaterial
        ref={materialRef}

        uniforms={{
          uTexture: {
            value: texture,
          },

          uMouse: {
            value: new THREE.Vector2(
              0.5,
              0.5
            ),
          },

          uVelocity: {
            value: new THREE.Vector2(
              0,
              0
            ),
          },
        }}

        vertexShader={`
          varying vec2 vUv;

          void main() {

            vUv = uv;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);

          }
        `}

        fragmentShader={`
          uniform sampler2D uTexture;
          uniform vec2 uMouse;
          uniform vec2 uVelocity;

          varying vec2 vUv;

          void main() {

            vec2 uv = vUv;


            // =====================================
            // DISTANCE FROM CURSOR
            // =====================================

            float distanceFromMouse =
              distance(
                uv,
                uMouse
              );


            // =====================================
            // SMALL SOFT DISTORTION AREA
            // =====================================

            /*
             * 0.22 = size of the distorted area.
             *
             * Smaller number = smaller area.
             * Larger number = larger area.
             */


float distortionRadius = 0.10;

float influence =
  1.0 - smoothstep(
    0.0,
    distortionRadius,
    distanceFromMouse
  );


            // =====================================
            // CURSOR SPEED
            // =====================================

            float speed =
              length(
                uVelocity
              );

            /*
             * Convert cursor movement into
             * usable fluid energy.
             */

            float energy =
              clamp(
                speed * 45.0,
                0.0,
                1.0
              );


            // =====================================
            // WATER RIPPLE
            // =====================================

            float ripple1 =
              sin(
                distanceFromMouse * 38.0
              );

            float ripple2 =
              sin(
                distanceFromMouse * 20.0
              );


            float ripple =
                ripple1 * 0.65
              + ripple2 * 0.35;


            // =====================================
            // DIRECTION FROM CURSOR
            // =====================================

            vec2 direction =
              uv - uMouse;

            float directionLength =
              length(direction);

            direction =
              direction /
              max(
                directionLength,
                0.001
              );


            // =====================================
            // FLUID PUSH
            // =====================================

            float push =
              ripple *
              influence *
              energy;


            /*
             * 0.075 = displacement strength.
             *
             * Higher = stronger distortion.
             * Lower = gentler distortion.
             */

            uv +=
              direction *
              push *
              0.075;


            // =====================================
            // FLOW WITH CURSOR
            // =====================================

            uv.x +=
              uVelocity.x *
              influence *
              1.5;

            uv.y +=
              uVelocity.y *
              influence *
              1.5;


            // =====================================
            // CROSS FLOW
            // =====================================

            float crossFlow =
              sin(
                uv.x * 24.0 +
                uv.y * 18.0
              );


            uv.x +=
              crossFlow *
              influence *
              energy *
              0.018;

            uv.y +=
              crossFlow *
              influence *
              energy *
              0.014;


            // =====================================
            // KEEP IMAGE INSIDE BOUNDS
            // =====================================

            uv = clamp(
              uv,
              0.001,
              0.999
            );


            // =====================================
            // GET IMAGE
            // =====================================

            vec3 color =
              texture2D(
                uTexture,
                uv
              ).rgb;


            // =====================================
            // OUTPUT
            // =====================================

            gl_FragColor =
              vec4(
                color,
                1.0
              );

          }
        `}
      />

    </mesh>
  )
}


export function App() {

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >

      <Canvas
        orthographic

        camera={{
          position: [0, 0, 5],
          zoom: 1,
        }}

        gl={{
          antialias: true,
        }}
      >

        <Landscape />

      </Canvas>

    </div>
  )
}