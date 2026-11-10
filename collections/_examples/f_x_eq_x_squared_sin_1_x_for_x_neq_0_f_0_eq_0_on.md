---
title: '$f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, on $[-1, 1]$'
level: undergraduate
is: [
  continuous,
  Lipschitz_continuous,
  uniformly_continuous,
  absolutely_continuous
]
is_not: [continuously_differentiable]
why:
  continuously_differentiable: |-
    The function $f$ is not continuously differentiable, because its derivative is not continuous at $0$.
    At $0$, we have $f^{\prime}(0) = 0$ because 
    
    $$\lim_{h \to 0} \frac{f(h) - f(0)}{h} = \lim_{h \to 0}  h \sin(1/h) = 0.$$
    
    Away from $0$, the product and chain rules give

    $$f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x),$$

    The points $x_n = 1 / (2 \pi n)$ tend to $0$, but $f^{\prime}(x_n) = 0 - \cos(2 \pi n) = -1$ for every $n$, so $f^{\prime}(x_n)$ does not tend to $f^{\prime}(0) = 0$. 
    That is, 

    $$f^{\prime}(0) \neq \lim_{x \to 0} f^{\prime}(x),$$
     
    because the limit does not exist.

    The discontinuity of $f^{\prime}$ at $0$ is not a jump discontinuity, at which the limits from the left and from the right exist but differ.
    Instead, $f^{\prime}$ oscillates: as $x \to 0$, the term $2x \sin(1/x)$ tends to $0$, but the term $-\cos(1/x)$ oscillates between $-1$ and $1$ faster and faster, so $f^{\prime}(x)$ has no limit from either side.
    This oscillation is the only way that a derivative can fail to be continuous, by Darboux's theorem: every derivative has the intermediate value property, so a derivative cannot have a jump discontinuity, such as the jump of a step function.
  Lipschitz_continuous: >-
    The function $f(x) = x^2 \sin(1/x)$ is Lipschitz continuous on $[-1, 1]$ because it is differentiable everywhere with $\abs{f^{\prime}(x)} \leq 3$.
---
