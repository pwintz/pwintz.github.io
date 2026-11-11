---
published: false
title: Improper integral
term: improper integral
applies_to: functions on unbounded intervals or with unbounded values
levels:
  undergraduate:
    text: |-
      Consider a function $f$ that is [Riemann integrable](/dictionary/definitions/riemann-integral) on $[a, t]$ for every $t > a$.
      The _improper integral_ of $f$ over $[a, \infty)$ is the limit

      $$\int_a^{\infty} f(x) \mathrm{d}x = \lim_{t \to \infty} \int_a^t f(x) \mathrm{d}x,$$

      when this limit exists.
      Integrals of functions that are unbounded near an endpoint are defined the same way, with a limit toward that endpoint.
properties:
  - >-
    An improper integral can exist even when $\int \abs{f}$ is infinite, as for $\int_0^{\infty} \frac{\sin x}{x} \mathrm{d}x$.
    Such a function has an improper integral but no [Lebesgue integral](/dictionary/definitions/lebesgue-integral).
---
