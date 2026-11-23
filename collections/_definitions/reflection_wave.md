---
published: false
title: Reflection of a Wave
term: reflection (of a wave)
applies_to: waves
levels:
  elementary:
    text: |-
      _Reflection_ is the bouncing back of a [wave](/dictionary/definitions/wave), such as light or sound, when the wave hits a surface.
      For example, an echo is a sound that reflected off of a wall or a cliff, and you can see yourself in a mirror because the mirror reflects light.
  high-school:
    text: |-
      Consider a [wave](/dictionary/definitions/wave) traveling through one material, such as air or water, that reaches the boundary with a second material.
      _Reflection_ is the process by which part or all of the wave turns back at the boundary and travels away from the boundary through the first material.
      The wave that turns back is called the _reflected wave_.
  undergraduate:
    text: |-
      Consider a [plane wave](/dictionary/definitions/plane-wave), called the _incident wave_, that travels through one medium toward a flat boundary with a second medium that has a different [wave speed](/dictionary/definitions/wave-speed) or [impedance](/dictionary/definitions/impedance).
      At the boundary, the [wave](/dictionary/definitions/wave) must satisfy boundary conditions, such as continuity of the pressure and of the normal velocity for sound.
      The incident wave and the wave transmitted into the second medium cannot satisfy the boundary conditions by themselves, so the wave in the first medium also contains a _reflected wave_, which travels away from the boundary.
      _Reflection_ is the production of the reflected wave.
properties:
  - >-
    (The law of reflection.)
    The angle of reflection equals the angle of incidence, where both [angles](/dictionary/definitions/angle) are measured from the [normal vector](/dictionary/definitions/normal-vector) of the boundary, and the reflected ray lies in the plane that contains the incident ray and the normal vector.
  - |-
    At normal incidence, the ratio of the [amplitude](/dictionary/definitions/amplitude) of the reflected pressure [wave](/dictionary/definitions/wave) to the amplitude of the incident pressure wave is the [reflection coefficient](/dictionary/definitions/reflection-coefficient)

    $$R = \frac{Z_2 - Z_1}{Z_2 + Z_1},$$

    where $Z_1$ and $Z_2$ are the [characteristic acoustic impedances](/dictionary/definitions/characteristic-acoustic-impedance) of the two media.
  - >-
    If the second medium has a much smaller [impedance](/dictionary/definitions/impedance) than the first, such as air above water, then $R \approx -1$, so nearly all of the [wave](/dictionary/definitions/wave) is reflected, with its waveform flipped upside down.
    If the second medium has a much larger impedance, such as rock below water, then $R \approx 1$, so nearly all of the wave is reflected without being flipped.
  - |-
    ([Total internal reflection](/dictionary/definitions/total-internal-reflection).)
    When a [wave](/dictionary/definitions/wave) reaches a medium in which the wave travels faster, at an [angle](/dictionary/definitions/angle) of incidence $\theta$ greater than the _critical angle_ $\theta_c$ such that

    $$\sin \theta_c = \frac{c_1}{c_2},$$

    all of the wave is reflected, and no wave travels away from the boundary in the second medium.
  - >-
    (The image method.)
    The [wave](/dictionary/definitions/wave) reflected from a flat boundary with $R = \pm 1$ is the same as the wave from a mirror-image source on the other side of the boundary, with its [amplitude](/dictionary/definitions/amplitude) multiplied by $R$.
---
### Other meanings of "reflection"

In geometry, a [reflection](/dictionary/definitions/reflection-geometry) is a transformation that flips space across a line or a plane, such as the map $x \mapsto x - 2 \ip{x}{n} n$ across the plane with unit normal $n$.
The two meanings are related: by the law of reflection, the direction of the reflected ray is the geometric reflection of the direction of the incident ray across the boundary.
