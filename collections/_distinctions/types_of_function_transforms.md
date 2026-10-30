---
published: false
title: Types of transforms
kind: siblings
areas: [analysis, control, differential-equations]
status: draft
summary: >
  The Fourier transform decomposes a function on the whole real line into frequencies. The Laplace transform of a function on $[0, \infty)$ adds exponential decay,
  so it exists for growing functions and suits initial value problems. The Z-transform is the version for sequences.
terms:
  - fourier_transform
  - laplace_transform
  - z_transform
examples_note: >-
  Does the ___ of the given function or sequence exist (as an ordinary integral or sum, for some values of its variable)?
examples:
  - example: f_t_eq_e_t_for_t_geq_0
    why: >-
      $\int_0^{\infty} e^{t} e^{-s t} \mathrm{d}t$ converges for $\operatorname{Re}(s) > 1$, but the Fourier integral diverges.
  - example: f_t_eq_e_minus_t_for_t_geq_0_f_t_eq_0_for_t_lt_0
    why: >-
      $F(s) = \frac{1}{s + 1}$ and $\hat{f}(\omega) = \frac{1}{1 + i \omega} = F(i \omega)$.
  - example: f_t_eq_e_minus_t_for_all_t_in_reals
    why: >-
      The (one-sided) Laplace transform only sees $t \geq 0$, so it ignores half of $f$.
  - example: x_n_eq_2_n_for_n_geq_0
    why: >-
      $X(z) = \frac{z}{z - 2}$ for $\lvert z \rvert > 2$.
see_also:
  - types_of_maps
---
## Notes

- If $f = 0$ for $t < 0$ and the Laplace transform converges on the imaginary axis, then $\hat{f}(\omega) = F(i \omega)$.
- Fourier analysis is natural for steady-state and frequency-response questions. The Laplace transform turns linear ODEs with initial conditions into algebraic equations, which is why it is used for transfer functions in control.
- Related transforms include the discrete-time Fourier transform (DTFT) and the discrete Fourier transform (DFT), which acts on finite sequences.
