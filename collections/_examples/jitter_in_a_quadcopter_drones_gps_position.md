---
title: 'Jitter in a quadcopter drone''s GPS position readings'
level: high-school
figure:
  widget: quadcopter
  params: { scenario: gps }
  caption: |-
    GPS readings of the position of a quadcopter drone flying to the right past clouds and trees, taken periodically, each with the drone's actual position at the reading.
    The button pauses the flight, and the slider changes the noise level.
  alt: A side view of a quadcopter drone flying to the right past scrolling clouds and trees, with purple crosses for its periodic GPS readings scattered around dots where the drone was. A slider sets the noise level.
is: [
  exogenous_input,
  measurement_noise
]
is_not: [
  disturbance,
  control_input
]
why:
  measurement_noise: >-
    Jitter in a quadcopter drones GPS position readings is measurement noise, because it changes what the controller sees, not where the drone is.
  disturbance: >-
    The GPS jitter is not a disturbance because it does not directly change the state of the drone (its position or velocity).
  control_input: >-
    Jitter in a quadcopter drone's GPS position readings is not a control input because it is not chosen.
  exogenous_input: >-
    Jitter in a quadcopter drones GPS position readings is an exogenous input, because it comes from outside the drone and its flight controller.
---
