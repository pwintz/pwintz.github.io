---
published: false
title: Improper Integral
term: improper integral
applies_to: functions on unbounded intervals or with unbounded values
levels:
  undergraduate:
    text: |-
      Consider a function $f$ that is [Riemann integrable](/dictionary/definitions/riemann-integral) on $[a, t]$ for every $t > a$.
      The _improper integral_ of $f$ over $[a, \infty)$ is the limit

      $$\int_a^{\infty} f(x) \dx = \lim_{t \to \infty} \int_a^t f(x) \dx,$$

      when this limit exists.
      Integrals of functions that are unbounded near an endpoint are defined the same way, with a limit toward that endpoint.
properties:
  - |-
    An improper integral can exist even when $\int \abs{f}$ is infinite, as for $\int_0^{\infty} \frac{\sin x}{x} \dx$.
    Such a function has an improper integral but no [Lebesgue integral](/dictionary/definitions/lebesgue-integral).
---
