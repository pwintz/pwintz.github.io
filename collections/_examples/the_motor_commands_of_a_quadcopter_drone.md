---
title: 'The motor commands of a quadcopter drone'
level: high-school
figure:
  widget: quadcopter
  params: { scenario: motors }
  caption: |-
    A quadcopter drone, with the thrust of its rotors (green) and its weight (orange).
    Change the motor command with the slider.
  alt: A side view of a quadcopter drone with green thrust arrows pointing up from its rotors and an orange weight arrow pointing down beside it. A slider sets the motor command.
is: [
  exogenous_input,
  control_input
]
is_not: [
  disturbance,
  measurement_noise
]
why:
  exogenous_input: >-
    The motor commands of a quadcopter drone are an exogenous input to the drone, because they come from outside the drones motion, from its flight controller.
  measurement_noise: >-
    The motor commands of a quadcopter drone are not measurement noise, because they are chosen, not imposed.
  disturbance: >-
    The motor commands of a quadcopter drone are not a disturbance, because they are chosen, not imposed.
  control_input: >-
    The motor commands of a quadcopter drone are a control input, because the flight controller chooses them.
---
