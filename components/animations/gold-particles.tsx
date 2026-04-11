"use client"

import { useEffect, useMemo, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { ISourceOptions } from "@tsparticles/engine"

export function GoldParticles() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#D4AF37", "#FFD700", "#F5E6A3"],
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: {
            default: "out" as const,
          },
        },
        number: {
          value: 50,
          density: {
            enable: true,
          },
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        twinkle: {
          particles: {
            enable: true,
            color: "#FFD700",
            frequency: 0.05,
            opacity: 1,
          },
        },
      },
      detectRetina: true,
    }),
    []
  )

  if (!init) return null

  return (
    <Particles
      id="gold-particles"
      options={options}
      className="absolute inset-0 pointer-events-none"
    />
  )
}
