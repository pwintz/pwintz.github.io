---
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
  disturbance: >-
    The GPS jitter is not a disturbance because it does not directly change the state of the drone (its position or velocity).
  control_input: >-
    Jitter in a quadcopter drone's GPS position readings is not a control input because it is not chosen.
---
