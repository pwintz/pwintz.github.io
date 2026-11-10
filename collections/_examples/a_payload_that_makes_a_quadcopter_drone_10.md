---
title: 'A payload that makes a quadcopter drone 10% heavier than modeled'
level: high-school
is: [perturbation]
is_not: [
  exogenous_input,
  measurement_noise
]
why:
  perturbation: >-
    The extra payload is a perturbation because it changes a parameter of the model, the drone's mass.
  # measurement_noise: >-
  #   A payload that makes a quadcopter drone 10% heavier than modeled is not measurement noise, because it is not a signal.
  # exogenous_input: >-
  #   A payload that makes a quadcopter drone 10% heavier than modeled is not an exogenous input, because it is not a signal.
---
