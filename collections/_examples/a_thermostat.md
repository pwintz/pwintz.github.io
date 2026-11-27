---
title: 'A thermostat'
level: elementary
is: [
  closed_loop,
  feedback
]
is_not: [
  open_loop,
  feedforward
]
why:
  feedforward: >-
    A thermostat is not feedforward, because it reacts to the measured temperature after a disturbance has already affected it.
  open_loop: >-
    A thermostat is not open loop because it reacts to measurements of the temperature.
  feedback: >-
    A thermostat is feedback control, because it measures the temperature and switches the heater according to the measurement.
  closed_loop: >-
    A thermostat is closed-loop control, because the temperature it controls is measured and fed back to decide whether the heater is on.
---
