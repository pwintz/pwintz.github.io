---
title: 'A payload that makes a quadcopter drone 10% heavier than modeled'
level: high-school
# figure:
#   widget: quadcopter
#   params: { scenario: payload }
#   caption: |-
#     A quadcopter drone carrying a payload, with the thrust of its rotors (green) and its weight (orange).
#     Change the extra mass with the slider.
#   alt: A side view of a quadcopter drone carrying a box below it, with green thrust arrows pointing up from its rotors and an orange weight arrow pointing down beside it. A slider sets the extra mass.
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
