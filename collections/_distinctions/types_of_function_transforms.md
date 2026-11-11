---
published: false
title: Types of transforms
kind: siblings
areas: [analysis, control, differential-equations]
summary: >
  Integral [transforms](/dictionary/definitions/transform) turn a function of time into a function of frequency, which is easier to analyze for linear systems.
  The [Fourier transform](/dictionary/definitions/fourier-transform) decomposes a function on the whole real line into frequencies.
  The [Laplace transform](/dictionary/definitions/laplace-transform) of a function on $[0, \infty)$ adds exponential decay, so it exists for growing functions and suits initial value problems.
  The [Z-transform](/dictionary/definitions/z-transform) is the version for sequences.
terms:
  - fourier_transform
  - laplace_transform
  - z_transform
examples_note: >-
  Does the ___ of the given function or sequence exist (as an ordinary integral or sum, for some values of its variable)?
examples:
  - example: f_t_eq_e_t_for_t_geq_0
  - example: f_t_eq_e_minus_t_for_t_geq_0_f_t_eq_0_for_t_lt_0
  - example: f_t_eq_e_minus_t_for_all_t_in_reals
    why: >-
      The one-sided Laplace transform of $e^{-\abs{t}}$ sees only $t \geq 0$, so it ignores half of the function.
  - example: x_n_eq_2_n_for_n_geq_0
see_also:
  - types_of_maps
---
## Notes

- If $f = 0$ for $t < 0$ and the [Laplace transform](/dictionary/definitions/laplace-transform) converges on the imaginary axis, then $\hat{f}(\omega) = F(i \omega)$.
- Fourier analysis is natural for steady-state and frequency-response questions.
  The Laplace transform turns linear ODEs with initial conditions into [algebraic equations](/dictionary/definitions/polynomial-equation), which is why it is used for transfer functions in control.
- Related [transforms](/dictionary/definitions/transform) include the discrete-time [Fourier transform](/dictionary/definitions/fourier-transform) (DTFT) and the discrete Fourier transform (DFT), which acts on finite sequences.
