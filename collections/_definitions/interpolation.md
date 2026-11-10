---
published: false
title: Interpolation
term: interpolation
applies_to: data
levels:
  high-school:
    text: |-
      Consider values of a quantity measured at several points.
      _Interpolation_ is estimating the value of the quantity at a point between the smallest and the largest measured point.
  undergraduate:
    text: |-
      Consider data points $(x_1, y_1), \dots, (x_n, y_n)$ with $x_1 < x_2 < \dots < x_n$.
      _Interpolation_ is estimating the value $y$ at a point $x$ inside the range of the data,

      $$x_1 \leq x \leq x_n,$$

      usually by evaluating at $x$ a function $f$ fitted to the data.
properties:
  - |-
    Linear interpolation between two data points $(x_1, y_1)$ and $(x_2, y_2)$ estimates

    $$y = y_1 + \frac{y_2 - y_1}{x_2 - x_1} (x - x_1).$$
  - >-
    Interpolating many equally spaced data points with a single [polynomial](/definitions/polynomial) can oscillate wildly near the ends of the range (Runge's phenomenon), which splines avoid.
---
In numerical analysis, interpolation means constructing a function $f$, called an _interpolant_, that passes exactly through the data points, so that $f(x_i) = y_i$ for every $i$.
In statistics, the word often means any prediction inside the range of the data, even from a fitted function that misses the data points, such as a regression line.
