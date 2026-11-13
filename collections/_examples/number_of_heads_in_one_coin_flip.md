---
published: false
title: 'The number of heads $X$ in one flip of a fair coin'
level: undergraduate
values:
  indicator_function: '$X = \mathbf{1}_{\setdef{\text{heads}}}$'
  characteristic_function_probability: '$\varphi_X(t) = (1 + e^{i t}) / 2$'
why:
  indicator_function: >-
    The number of heads $X$ in one coin flip is the indicator function of the event $\setdef{\text{heads}}$ on the sample space $\setdef{\text{heads}, \text{tails}}$, because $X$ is $1$ on heads and $0$ on tails.
  characteristic_function_probability: >-
    The characteristic function of the number of heads $X$ in one fair coin flip is $\varphi_X(t) = \mathbb{E}[e^{i t X}] = \frac{1}{2} e^{0} + \frac{1}{2} e^{i t}$, because $X$ is $0$ or $1$, each with probability $\frac{1}{2}$.
---
