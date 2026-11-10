---
published: false
title: 'Jitter in a quadcopter drone''s GPS position readings'
level: high-school
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
    The GPS jitter is measurement noise, and so an exogenous input, because it changes what the controller sees, not where the drone is.
  control_input: >-
    Jitter in a quadcopter drone's GPS position readings is not a disturbance or a control input.
---
