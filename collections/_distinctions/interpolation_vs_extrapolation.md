---
published: false
title: Interpolation vs. extrapolation
kind: siblings
areas: [analysis, statistics]
summary: >
  Given values of a quantity measured at several points, one often wants to estimate the value at a new point.
  [Interpolation](/definitions/interpolation) estimates the value at a point inside the range of the measured points.
  [Extrapolation](/definitions/extrapolation) estimates the value at a point outside that range, which is less reliable, because the data say nothing about how the quantity behaves there.
terms:
  - interpolation
  - extrapolation
examples:
  - example: estimating_y_at_1_and_at_3_from_0_0_and_2_4
    why: >-
      Estimating $y$ at $x = 1$ and at $x = 3$ from the data points $(0, 0)$ and $(2, 4)$ uses the same line $y = 2x$; only the location of the new point, inside or outside the range $[0, 2]$, decides whether the estimate is interpolation or extrapolation.
  - example: estimating_the_temperature_at_noon_from_9_am_and_3_pm
  - example: predicting_a_population_in_2040_from_censuses_2000_to_2020
---
## Notes

- In numerical analysis, "[interpolation](/definitions/interpolation)" often means constructing a function that passes exactly through the data points, not only estimating a value between them.
- Forecasting, which is predicting future values from past values, is a kind of [extrapolation](/definitions/extrapolation) in time.
