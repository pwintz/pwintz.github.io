---
published: false
title: '$f(x) = \frac{\sin x}{x}$ on $(0, \infty)$'
level: undergraduate
values:
  riemann_integral: 'None'
  improper_integral: '$\lim_{t \to \infty} \int_0^t \frac{\sin x}{x} \mathrm{d}x = \frac{\pi}{2}$'
  lebesgue_integral: 'None'
why:
  riemann_integral: >-
    The function $\frac{\sin x}{x}$ has no Riemann integral on $(0, \infty)$, because Riemann integrals are only defined on bounded intervals.
  improper_integral: >-
    The improper integral of $\frac{\sin x}{x}$ exists because the positive and negative humps of the graph cancel more and more exactly; its value $\frac{\pi}{2}$ comes from complex analysis.
  lebesgue_integral: >-
    The function $\frac{\sin x}{x}$ is not Lebesgue integrable on $(0, \infty)$, because $\int_0^{\infty} \abs{\frac{\sin x}{x}} \mathrm{d}x = \infty$: the Lebesgue integral requires the positive and negative parts to have finite integrals separately.
---
