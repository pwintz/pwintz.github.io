---
published: false
title: Laplace transform
term: Laplace transform
applies_to: functions
synonyms: ["$\\mathcal{L}f$", $F(s)$]
levels:
  high-school:
    text: |-
      Consider a function of time, such as a signal that starts at time $0$.
      The _Laplace transform_ turns the function into a function of a (complex) frequency, which turns linear differential equations into [algebraic equations](/dictionary/definitions/polynomial-equation).
  undergraduate:
    text: |-
      Consider a function $f$ defined on $[0, \infty)$.
      The _Laplace transform_ of $f$ is

      $$F(s) = \int_0^{\infty} f(t) e^{-s t} \mathrm{d}t,$$

      for the complex numbers $s$ where the integral converges (its region of convergence).
---
