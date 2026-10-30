---
published: false
title: Predictor
term: predictor
applies_to: state estimation
levels:
  high-school:
    text: |-
      A _predictor_ estimates a future value from the data available now.
  undergraduate:
    text: |-
      A _predictor_ estimates a future state $x(t + \tau)$, with $\tau > 0$, from measurements up to time $t$.
---
A _smoother_ does the opposite: it estimates a past state $x(t - \tau)$ from measurements up to time $t$, which is more accurate than filtering because it uses later measurements.
