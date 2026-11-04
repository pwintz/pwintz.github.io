---
published: false
title: Measurement noise
term: measurement noise
applies_to: control systems
synonyms: [sensor noise]
levels:
  high-school:
    text: |-
      Consider a system whose state is measured by sensors.
      _Measurement noise_ is random error in the sensor readings, which changes what is measured but not the system itself.
  undergraduate:
    context: control systems
    text: |-
      Consider a control system whose output is measured as $y = h(x) + v$.
      _Measurement noise_ is an unwanted signal, such as $v$, that corrupts the measurements.
      It affects what the controller sees, but not the true state directly.
---
"White noise" has uncorrelated values at different times and a flat power spectrum.
"Brown" (Brownian) noise is the integral of white noise, with power proportional to $1 / f^2$ at frequency $f$.
