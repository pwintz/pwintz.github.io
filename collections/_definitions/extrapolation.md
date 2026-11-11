---
published: false
title: Extrapolation
term: extrapolation
applies_to: data
levels:
  high-school:
    text: |-
      Consider values of a quantity measured at several points.
      _Extrapolation_ is estimating the value of the quantity at a point beyond the measured points: smaller than the smallest measured point or larger than the largest.
  undergraduate:
    text: |-
      Consider data points $(x_1, y_1), \dots, (x_n, y_n)$ with $x_1 < x_2 < \dots < x_n$.
      _Extrapolation_ is estimating the value $y$ at a point $x$ outside the range of the data,

      $$x < x_1 \quad \text{or} \quad x > x_n,$$

      usually by evaluating at $x$ a function $f$ fitted to the data.
properties:
  - >-
    Extrapolation is less reliable than [interpolation](/dictionary/definitions/interpolation), because the data give no information about how the quantity behaves outside the range of the data.
  - >-
    The error of an extrapolation usually grows with the distance from the range of the data.
---
For data in several dimensions, "inside the range" usually means inside the convex hull of the data points.
