---
title: Predictor
term: predictor
applies_to: state estimation
levels:
  high-school:
    text: |-
      Consider a quantity that changes over time, and the data about it available now.
      A _predictor_ estimates a future value of the quantity from that data.
  undergraduate:
    text: |-
      Consider a system with state $x(t)$, measured up to time $t$, and a time $\tau > 0$ into the future.
      A _predictor_ estimates the future state $x(t + \tau)$ from the measurements up to time $t$.
---
<!-- A _smoother_ does the opposite: it estimates a past state $x(t - \tau)$ from measurements up to time $t$, which is more accurate than filtering because it uses later measurements. -->
