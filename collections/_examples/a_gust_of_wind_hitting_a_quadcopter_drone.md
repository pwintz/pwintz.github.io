---
title: 'A gust of wind hitting a quadcopter drone'
level: high-school
is: [
  exogenous_input,
  disturbance
]
is_not: [
  control_input,
  measurement_noise
]
figure:
  widget: quadcopter
  params: { scenario: gust }
  caption: |-
    A quadcopter drone in gusty wind (blue arrows), with the target where it tries to hover (dashed outline) and its recent path (fading line).
    Change the gust's strength with the slider, or pause the animation.
  alt: An animated side view of a quadcopter drone that wanders around a dashed outline of the drone at its target as wind arrows change in strength and direction. A slider sets the gust's strength.
why:
  exogenous_input: >-
    A gust of wind hitting a quadcopter drone is an exogenous input, because it comes from outside the drone and its flight controller.
  measurement_noise: >-
    A gust of wind hitting a quadcopter drone is not measurement noise, because it changes where the drone actually is, not only what its sensors report.
  disturbance: >-
    A gust of wind hitting a quadcopter drone is a disturbance, because it is an unwanted input that changes the drones actual motion, and nobody chooses it.
  control_input: >-
    A gust of wind hitting a quadcopter drone is not a control input, because the flight controller does not choose it.
---
